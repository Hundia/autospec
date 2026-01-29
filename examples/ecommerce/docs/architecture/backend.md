# ShopFlow Backend Architecture

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Backend Engineering

---

## 1. Layered Architecture

### 1.1 Layer Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Layer (Express)                     │
│  Routes → Middleware → Controllers                           │
├─────────────────────────────────────────────────────────────┤
│                     Business Layer                           │
│  Services → Domain Logic → Validation                        │
├─────────────────────────────────────────────────────────────┤
│                     Data Access Layer                        │
│  Repositories → Prisma ORM → Database                        │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure Layer                     │
│  Cache → Queue → External APIs → Storage                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| Routes | URL mapping, HTTP method handling | `router.get('/products', ...)` |
| Middleware | Cross-cutting concerns | Auth, logging, rate limiting |
| Controllers | Request/response handling | Parse input, format output |
| Services | Business logic | Order processing, pricing |
| Repositories | Data persistence | CRUD operations |
| Infrastructure | External integrations | Stripe, SendGrid, S3 |

---

## 2. Directory Structure

```
backend/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── app.ts                   # Express app configuration
│   │
│   ├── config/
│   │   ├── index.ts             # Configuration aggregator
│   │   ├── database.ts          # Database config
│   │   ├── redis.ts             # Redis config
│   │   ├── stripe.ts            # Stripe config
│   │   └── email.ts             # SendGrid config
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── authorize.ts         # Role-based authorization
│   │   ├── validate.ts          # Request validation
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   ├── errorHandler.ts      # Global error handler
│   │   └── requestLogger.ts     # Request logging
│   │
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.routes.ts       # /api/v1/auth
│   │   ├── products.routes.ts   # /api/v1/products
│   │   ├── categories.routes.ts # /api/v1/categories
│   │   ├── cart.routes.ts       # /api/v1/cart
│   │   ├── checkout.routes.ts   # /api/v1/checkout
│   │   ├── orders.routes.ts     # /api/v1/orders
│   │   ├── users.routes.ts      # /api/v1/users
│   │   └── admin.routes.ts      # /api/v1/admin
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── checkout.controller.ts
│   │   ├── orders.controller.ts
│   │   └── users.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── cart.service.ts
│   │   ├── checkout.service.ts
│   │   ├── orders.service.ts
│   │   ├── payment.service.ts
│   │   ├── email.service.ts
│   │   └── search.service.ts
│   │
│   ├── repositories/
│   │   ├── base.repository.ts
│   │   ├── users.repository.ts
│   │   ├── products.repository.ts
│   │   ├── cart.repository.ts
│   │   ├── orders.repository.ts
│   │   └── coupons.repository.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── products.validator.ts
│   │   ├── cart.validator.ts
│   │   └── checkout.validator.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── products.types.ts
│   │   ├── cart.types.ts
│   │   ├── orders.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── password.ts          # Password hashing
│   │   ├── slug.ts              # Slug generation
│   │   ├── pagination.ts        # Pagination helpers
│   │   └── response.ts          # Response formatters
│   │
│   └── errors/
│       ├── AppError.ts          # Base error class
│       ├── AuthError.ts         # Authentication errors
│       ├── ValidationError.ts   # Validation errors
│       └── NotFoundError.ts     # Not found errors
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Migration files
│   └── seed.ts                  # Seed data
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── products.test.ts
│   │   └── cart.test.ts
│   └── fixtures/
│       └── testData.ts
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 3. Middleware Chain

### 3.1 Middleware Order

```typescript
// app.ts - Middleware applied in order

app.use(helmet());                    // 1. Security headers
app.use(cors(corsOptions));           // 2. CORS
app.use(express.json({ limit: '10mb' })); // 3. JSON parser
app.use(requestLogger);               // 4. Request logging
app.use('/api', rateLimiter);         // 5. Rate limiting

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
// ... more routes

app.use(notFoundHandler);             // 6. 404 handler
app.use(errorHandler);                // 7. Error handler
```

### 3.2 Authentication Middleware

```typescript
// middleware/auth.ts

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('No token provided', 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' }
      });
    }
    next(error);
  }
};
```

### 3.3 Authorization Middleware

```typescript
// middleware/authorize.ts

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthError('Not authenticated', 'UNAUTHENTICATED');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthError(
        'Insufficient permissions',
        'FORBIDDEN'
      );
    }

    next();
  };
};

// Usage in routes
router.delete(
  '/products/:id',
  authenticate,
  authorize('admin', 'merchant'),
  productController.delete
);
```

---

## 4. Controller Pattern

### 4.1 Controller Structure

```typescript
// controllers/products.controller.ts

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, category, minPrice, maxPrice, sort } = req.query;

      const filters: ProductFilters = {
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      };

      const pagination: Pagination = {
        page: Number(page) || 1,
        limit: Math.min(Number(limit) || 20, 100),
      };

      const result = await this.productsService.getProducts(
        filters,
        pagination,
        sort as string
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await this.productsService.getProduct(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 5. Service Layer

### 5.1 Service Pattern

```typescript
// services/cart.service.ts

export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private productsRepository: ProductsRepository,
    private redisCache: RedisCache
  ) {}

  async addItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number
  ): Promise<Cart> {
    // 1. Validate product exists and has stock
    const product = await this.productsRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // 2. Check stock for variant or main product
    const stockQuantity = variantId
      ? this.getVariantStock(product, variantId)
      : product.stockQuantity;

    if (stockQuantity < quantity) {
      throw new ValidationError('Insufficient stock', {
        available: stockQuantity,
        requested: quantity
      });
    }

    // 3. Get current price
    const price = this.calculateItemPrice(product, variantId);

    // 4. Add or update cart item
    const cart = await this.cartRepository.addItem(
      cartId,
      productId,
      variantId,
      quantity,
      price
    );

    // 5. Invalidate cache
    await this.redisCache.delete(`cart:${cartId}`);

    return cart;
  }

  async getCart(userId: string | null, sessionId: string | null): Promise<Cart> {
    const cacheKey = userId ? `cart:user:${userId}` : `cart:session:${sessionId}`;

    // Try cache first
    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const cart = await this.cartRepository.findByUserOrSession(userId, sessionId);

    if (cart) {
      // Enrich with current product data
      const enrichedCart = await this.enrichCartWithProductData(cart);

      // Cache for 5 minutes
      await this.redisCache.set(cacheKey, JSON.stringify(enrichedCart), 300);

      return enrichedCart;
    }

    // Return empty cart structure
    return this.createEmptyCart(userId, sessionId);
  }
}
```

---

## 6. Repository Layer

### 6.1 Base Repository

```typescript
// repositories/base.repository.ts

export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaClient) {}

  abstract findById(id: string): Promise<T | null>;
  abstract findAll(filters?: any, pagination?: Pagination): Promise<T[]>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;

  protected paginate(page: number, limit: number) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  protected async count(where: any): Promise<number> {
    return this.prisma.$queryRaw`SELECT COUNT(*) FROM ...`;
  }
}
```

### 6.2 Product Repository Example

```typescript
// repositories/products.repository.ts

export class ProductsRepository extends BaseRepository<Product> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        deletedAt: null
      },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: 'asc' } }
      }
    });
  }

  async findAll(
    filters: ProductFilters,
    pagination: Pagination,
    sort?: string
  ): Promise<{ products: Product[]; total: number }> {
    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(sort);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        ...this.paginate(pagination.page, pagination.limit),
        include: {
          category: true,
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          _count: { select: { reviews: true } }
        }
      }),
      this.prisma.product.count({ where })
    ]);

    return { products, total };
  }

  private buildWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null
    };

    if (filters.category) {
      where.category = { slug: filters.category };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
      };
    }

    if (filters.brand) {
      where.brand = { slug: filters.brand };
    }

    if (filters.inStock) {
      where.stockQuantity = { gt: 0 };
    }

    return where;
  }
}
```

---

## 7. Error Handling

### 7.1 Custom Error Classes

```typescript
// errors/AppError.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string = 'AUTH_ERROR') {
    super(message, code, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code, 409);
  }
}
```

### 7.2 Global Error Handler

```typescript
// middleware/errorHandler.ts

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    path: req.path,
    method: req.method
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId: req.id
      }
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'Resource already exists',
          requestId: req.id
        }
      });
    }
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })),
        requestId: req.id
      }
    });
  }

  // Unknown error - don't leak details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
      requestId: req.id
    }
  });
};
```

---

## 8. Logging Strategy

### 8.1 Logger Configuration

```typescript
// utils/logger.ts

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  })
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      requestId: req.id,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
  });

  next();
};
```

---

## 9. Testing Patterns

### 9.1 Service Unit Tests

```typescript
// tests/unit/services/cart.service.test.ts

describe('CartService', () => {
  let cartService: CartService;
  let mockCartRepo: jest.Mocked<CartRepository>;
  let mockProductsRepo: jest.Mocked<ProductsRepository>;
  let mockRedisCache: jest.Mocked<RedisCache>;

  beforeEach(() => {
    mockCartRepo = createMockCartRepository();
    mockProductsRepo = createMockProductsRepository();
    mockRedisCache = createMockRedisCache();

    cartService = new CartService(
      mockCartRepo,
      mockProductsRepo,
      mockRedisCache
    );
  });

  describe('addItem', () => {
    it('should add item to cart when product has sufficient stock', async () => {
      // Arrange
      const product = createTestProduct({ stockQuantity: 10 });
      mockProductsRepo.findById.mockResolvedValue(product);
      mockCartRepo.addItem.mockResolvedValue(createTestCart());

      // Act
      const result = await cartService.addItem('cart_1', 'prod_1', null, 2);

      // Assert
      expect(mockCartRepo.addItem).toHaveBeenCalledWith(
        'cart_1', 'prod_1', null, 2, product.price
      );
      expect(result).toBeDefined();
    });

    it('should throw error when product is out of stock', async () => {
      // Arrange
      const product = createTestProduct({ stockQuantity: 0 });
      mockProductsRepo.findById.mockResolvedValue(product);

      // Act & Assert
      await expect(
        cartService.addItem('cart_1', 'prod_1', null, 1)
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

### 9.2 Integration Tests

```typescript
// tests/integration/auth.test.ts

describe('Auth API', () => {
  let app: Express;
  let testUser: User;

  beforeAll(async () => {
    app = createTestApp();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should return 409 for duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com', // Same email as above
          password: 'SecurePass123!',
          firstName: 'Another',
          lastName: 'User'
        });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });
  });
});
```

---

## 10. Performance Considerations

### 10.1 Database Query Optimization

```typescript
// Use select to limit returned fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    slug: true,
    images: { select: { url: true }, take: 1 }
  }
});

// Use indexes in queries
// Prisma schema: @@index([categoryId, isActive, price])

// Batch operations
await prisma.$transaction([
  prisma.cartItem.deleteMany({ where: { cartId } }),
  prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } })
]);
```

### 10.2 Caching Strategy

```typescript
// Cache frequently accessed data
const CACHE_TTL = {
  CATEGORIES: 3600,      // 1 hour
  PRODUCT_LIST: 300,     // 5 minutes
  PRODUCT_DETAIL: 600,   // 10 minutes
  CART: 300,             // 5 minutes
  USER_SESSION: 86400    // 24 hours
};

// Cache invalidation on updates
async function updateProduct(id: string, data: ProductUpdate) {
  const product = await productsRepository.update(id, data);

  // Invalidate related caches
  await Promise.all([
    redis.del(`product:${id}`),
    redis.del(`product:slug:${product.slug}`),
    redis.del(`products:category:${product.categoryId}`)
  ]);

  return product;
}
```

---

*Document End - Backend Architecture*
