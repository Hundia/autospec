# ShopFlow E-commerce - Sprint 1 Development Execution Prompt

## Context

You are implementing Sprint 1 of ShopFlow, building shopping cart, checkout, orders, and reviews on top of Sprint 0.

---

## Prerequisites

- Sprint 0 completed (`sprint-0-complete`)
- Users, products, categories tables exist
- Auth system working

---

## New Database Migrations

Run migrations for new tables:

```bash
npx prisma migrate dev --name add_cart_tables
npx prisma migrate dev --name add_address_table
npx prisma migrate dev --name add_order_tables
npx prisma migrate dev --name add_review_table
```

---

## Cart Endpoints Implementation

### GET /api/v1/cart

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "id": "cart-uuid",
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "product-uuid",
          "name": "Classic Cotton T-Shirt",
          "price": "29.99",
          "stockQuantity": 150,
          "image": "https://..."
        },
        "quantity": 2,
        "lineTotal": "59.98"
      }
    ],
    "itemCount": 2,
    "subtotal": "59.98"
  }
}
```

### POST /api/v1/cart/items

```typescript
// Request
{
  "productId": "product-uuid",
  "quantity": 2
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "item-uuid",
    "productId": "product-uuid",
    "quantity": 2,
    "product": {...}
  }
}
```

### PUT /api/v1/cart/items/:id

```typescript
// Request
{
  "quantity": 3
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "item-uuid",
    "quantity": 3,
    ...
  }
}
```

### DELETE /api/v1/cart/items/:id

```typescript
// Response (200)
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Address Endpoints

### POST /api/v1/addresses

```typescript
// Request
{
  "type": "SHIPPING",
  "firstName": "John",
  "lastName": "Doe",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "phone": "+1234567890",
  "isDefault": true
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "address-uuid",
    ...
  }
}
```

### GET /api/v1/addresses

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "uuid",
        "type": "SHIPPING",
        "firstName": "John",
        "lastName": "Doe",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US",
        "isDefault": true
      }
    ]
  }
}
```

---

## Order Endpoints

### POST /api/v1/orders (Checkout)

```typescript
// Request
{
  "shippingAddressId": "address-uuid",
  "billingAddressId": "address-uuid"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-20260130-001",
    "status": "PENDING",
    "items": [
      {
        "id": "item-uuid",
        "productName": "Classic Cotton T-Shirt",
        "quantity": 2,
        "unitPrice": "29.99",
        "totalPrice": "59.98"
      }
    ],
    "subtotal": "59.98",
    "tax": "5.40",
    "shippingCost": "9.99",
    "total": "75.37",
    "shippingAddress": {...},
    "createdAt": "..."
  }
}
```

### GET /api/v1/orders

```typescript
// Query: ?page=1&limit=10&status=PENDING

// Response (200)
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "orderNumber": "ORD-20260130-001",
        "status": "PENDING",
        "total": "75.37",
        "itemCount": 1,
        "createdAt": "..."
      }
    ],
    "pagination": {...}
  }
}
```

### GET /api/v1/orders/:id

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-20260130-001",
    "status": "PENDING",
    "items": [...],
    "subtotal": "59.98",
    "tax": "5.40",
    "shippingCost": "9.99",
    "total": "75.37",
    "shippingAddress": {...},
    "billingAddress": {...},
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /api/v1/orders/:id/cancel

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "CANCELLED",
    ...
  }
}
```

---

## Checkout Service Implementation

```typescript
// src/services/checkout.service.ts
export class CheckoutService {
  constructor(
    private cartRepository: CartRepository,
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}

  async createOrder(userId: string, data: CreateOrderDto): Promise<Order> {
    // 1. Get cart
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    // 2. Validate stock
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new BadRequestError(`Product ${item.productId} not found`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`);
      }
    }

    // 3. Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity);
    }, 0);

    const tax = subtotal * 0.09; // 9% tax
    const shippingCost = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + tax + shippingCost;

    // 4. Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal,
          tax,
          shippingCost,
          total,
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Decrease stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cart.delete({ where: { id: cart.id } });

      return order;
    });

    return order;
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.orderRepository.countTodaysOrders();
    return `ORD-${date}-${String(count + 1).padStart(3, '0')}`;
  }
}
```

---

## Review Endpoints

### GET /api/v1/products/:id/reviews

```typescript
// Query: ?page=1&limit=10&sortBy=createdAt&sortOrder=desc

// Response (200)
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review-uuid",
        "rating": 5,
        "title": "Great quality!",
        "content": "Very comfortable and fits perfectly.",
        "isVerified": true,
        "user": {
          "firstName": "John",
          "lastName": "D."
        },
        "createdAt": "..."
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 28,
      "distribution": {
        "5": 15,
        "4": 8,
        "3": 3,
        "2": 1,
        "1": 1
      }
    },
    "pagination": {...}
  }
}
```

### POST /api/v1/products/:id/reviews

```typescript
// Request
{
  "rating": 5,
  "title": "Great quality!",
  "content": "Very comfortable and fits perfectly."
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "review-uuid",
    "rating": 5,
    "title": "Great quality!",
    "content": "Very comfortable and fits perfectly.",
    "isVerified": true,  // true if user purchased this product
    "createdAt": "..."
  }
}
```

---

## Validation Schemas

```typescript
// src/schemas/cart.schema.ts
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid item ID'),
  }),
});

// src/schemas/address.schema.ts
export const createAddressSchema = z.object({
  body: z.object({
    type: z.enum(['SHIPPING', 'BILLING']),
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().min(1, 'Last name required'),
    street: z.string().min(1, 'Street required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(1, 'State required'),
    postalCode: z.string().min(1, 'Postal code required'),
    country: z.string().min(2).max(2, 'Use 2-letter country code'),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

// src/schemas/order.schema.ts
export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid('Invalid shipping address'),
    billingAddressId: z.string().uuid('Invalid billing address'),
  }),
});

// src/schemas/review.schema.ts
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).optional(),
    content: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});
```

---

## Testing Requirements

```typescript
// tests/cart.test.ts
describe('Cart Endpoints', () => {
  it('should add item to cart', async () => {
    const response = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body.data.quantity).toBe(2);
  });

  it('should validate stock when adding to cart', async () => {
    const response = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1000 });

    expect(response.status).toBe(400);
  });
});

// tests/checkout.test.ts
describe('Checkout', () => {
  it('should create order from cart', async () => {
    // Add items to cart first
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    // Checkout
    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddressId, billingAddressId });

    expect(response.status).toBe(201);
    expect(response.body.data.orderNumber).toBeDefined();
  });

  it('should decrease stock after checkout', async () => {
    // Verify stock decreased
  });

  it('should clear cart after checkout', async () => {
    // Verify cart empty
  });
});
```

---

## Commands Reference

```bash
# Run migrations
npx prisma migrate dev

# Generate client
npx prisma generate

# Run tests
npm run test

# Specific tests
npm run test -- cart.test.ts
npm run test -- checkout.test.ts
npm run test -- review.test.ts
```

---

## Checklist Before Completing Sprint 1

- [ ] Cart migrations applied
- [ ] Address migrations applied
- [ ] Order migrations applied
- [ ] Review migrations applied
- [ ] Cart CRUD working
- [ ] Address CRUD working
- [ ] Checkout creates order
- [ ] Stock decreases on checkout
- [ ] Cart clears after checkout
- [ ] Order listing working
- [ ] Order detail working
- [ ] Order cancellation working
- [ ] Reviews CRUD working
- [ ] Verified reviews flagged correctly
- [ ] All tests passing
- [ ] Sprint 0 regression passing
