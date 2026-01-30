# ShopFlow Integration Tests

## Overview

Integration testing patterns for the ShopFlow e-commerce platform.

---

## Integration Test Architecture

```mermaid
flowchart TB
    subgraph TestRunner["Jest + Supertest"]
        SETUP[Global Setup]
        TESTS[Test Suites]
        TEARDOWN[Global Teardown]
    end

    subgraph Docker["Docker Services"]
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        ES[(Elasticsearch)]
        MOCK[Mock Services]
    end

    subgraph App["Application"]
        API[API Server]
        WORKER[Workers]
    end

    SETUP --> Docker
    Docker --> App
    App --> TESTS
    TESTS --> TEARDOWN
```

---

## Test Environment Setup

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  postgres-test:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: shopflow_test
    ports:
      - "5433:5432"
    tmpfs:
      - /var/lib/postgresql/data

  redis-test:
    image: redis:7-alpine
    ports:
      - "6380:6379"

  elasticsearch-test:
    image: elasticsearch:8.11.3
    environment:
      discovery.type: single-node
      xpack.security.enabled: false
    ports:
      - "9201:9200"
```

---

## API Endpoint Tests

### Product Endpoints

```typescript
// tests/integration/api/products.test.ts
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { seedProducts } from '@/tests/seeds/products';

describe('Products API', () => {
  let authToken: string;

  beforeAll(async () => {
    await seedProducts();
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
      });
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: 'clothing' })
        .expect(200);

      response.body.data.forEach((product: any) => {
        expect(product.category.slug).toBe('clothing');
      });
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ minPrice: 20, maxPrice: 50 })
        .expect(200);

      response.body.data.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(20);
        expect(product.price).toBeLessThanOrEqual(50);
      });
    });

    it('should search products', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ q: 'shirt' })
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product details', async () => {
      const product = await prisma.product.findFirst();

      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: product.id,
        name: product.name,
        variants: expect.any(Array),
      });
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/prod_nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error.code).toBe('PRODUCT_NOT_FOUND');
    });
  });
});
```

### Cart Endpoints

```typescript
// tests/integration/api/cart.test.ts
describe('Cart API', () => {
  let authToken: string;
  let testProduct: any;

  beforeAll(async () => {
    authToken = await getAuthToken();
    testProduct = await prisma.product.create({
      data: {
        name: 'Test Product',
        price: 29.99,
        stock: 100,
      },
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: testProduct.id,
          quantity: 2,
        })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0]).toMatchObject({
        productId: testProduct.id,
        quantity: 2,
        price: 29.99,
      });
      expect(response.body.subtotal).toBe(59.98);
    });

    it('should increment quantity for existing item', async () => {
      // Add initial item
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProduct.id, quantity: 1 });

      // Add same item again
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProduct.id, quantity: 2 })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(3);
    });

    it('should reject when exceeding stock', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: testProduct.id,
          quantity: 1000,
        })
        .expect(400);

      expect(response.body.error.code).toBe('INSUFFICIENT_STOCK');
    });
  });

  describe('POST /api/cart/coupon', () => {
    it('should apply valid coupon', async () => {
      await prisma.coupon.create({
        data: {
          code: 'TEST10',
          type: 'percentage',
          value: 10,
          active: true,
        },
      });

      const response = await request(app)
        .post('/api/cart/coupon')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'TEST10' })
        .expect(200);

      expect(response.body.discount).toBeGreaterThan(0);
    });

    it('should reject expired coupon', async () => {
      await prisma.coupon.create({
        data: {
          code: 'EXPIRED',
          type: 'percentage',
          value: 20,
          active: true,
          expiresAt: new Date('2020-01-01'),
        },
      });

      const response = await request(app)
        .post('/api/cart/coupon')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'EXPIRED' })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_COUPON');
    });
  });
});
```

---

## Order Flow Tests

```typescript
// tests/integration/api/orders.test.ts
describe('Order Flow', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
    await setupCartWithItems(authToken);
  });

  describe('Complete Checkout Flow', () => {
    it('should complete full checkout process', async () => {
      // 1. Create order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
          },
          paymentMethodId: 'pm_card_visa',
        })
        .expect(201);

      expect(orderResponse.body).toMatchObject({
        orderNumber: expect.stringMatching(/^SF-/),
        status: 'pending',
      });

      const orderId = orderResponse.body.id;

      // 2. Verify order details
      const detailResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(detailResponse.body.items.length).toBeGreaterThan(0);

      // 3. Verify cart is cleared
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cartResponse.body.items).toHaveLength(0);
    });
  });
});
```

---

## Database Integration Tests

```typescript
// tests/integration/db/product-repository.test.ts
import { ProductRepository } from '@/repositories/product';
import { prisma } from '@/lib/prisma';

describe('ProductRepository', () => {
  let repository: ProductRepository;

  beforeAll(() => {
    repository = new ProductRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  describe('search', () => {
    it('should search products by name', async () => {
      await prisma.product.createMany({
        data: [
          { name: 'Blue T-Shirt', price: 29.99 },
          { name: 'Red T-Shirt', price: 24.99 },
          { name: 'Blue Jeans', price: 59.99 },
        ],
      });

      const results = await repository.search('t-shirt');

      expect(results).toHaveLength(2);
      results.forEach((p) => {
        expect(p.name.toLowerCase()).toContain('t-shirt');
      });
    });

    it('should filter by category', async () => {
      await prisma.product.createMany({
        data: [
          { name: 'Shirt', categoryId: 'clothing', price: 29.99 },
          { name: 'Phone', categoryId: 'electronics', price: 599.99 },
        ],
      });

      const results = await repository.findByCategory('clothing');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Shirt');
    });
  });
});
```

---

## External Service Integration

```typescript
// tests/integration/services/stripe.test.ts
import Stripe from 'stripe';
import { PaymentService } from '@/services/payment';

describe('PaymentService (Stripe)', () => {
  let service: PaymentService;

  beforeAll(() => {
    service = new PaymentService(
      new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
    );
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      const intent = await service.createPaymentIntent({
        amount: 5999, // $59.99
        currency: 'usd',
        customerId: 'cus_test123',
      });

      expect(intent.id).toMatch(/^pi_/);
      expect(intent.amount).toBe(5999);
      expect(intent.status).toBe('requires_payment_method');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment with test card', async () => {
      const intent = await service.createPaymentIntent({
        amount: 2999,
        currency: 'usd',
      });

      const confirmed = await service.confirmPayment(intent.id, {
        payment_method: 'pm_card_visa',
      });

      expect(confirmed.status).toBe('succeeded');
    });
  });
});
```

---

## Running Integration Tests

```bash
# Start test services
docker compose -f docker-compose.test.yml up -d

# Run migrations
DATABASE_URL=postgresql://test:test@localhost:5433/shopflow_test npx prisma migrate deploy

# Run integration tests
npm run test:integration

# Run specific test
npm run test:integration -- cart.test.ts

# Stop services
docker compose -f docker-compose.test.yml down
```

---

## Related Documents

- [Testing Strategy](./strategy.md)
- [Unit Tests](./unit-tests.md)
- [E2E Tests](./e2e-tests.md)
