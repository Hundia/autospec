# ShopFlow E-commerce - Sprint 0 Development Execution Prompt

## Context

You are implementing Sprint 0 of ShopFlow, a full-stack e-commerce platform. This sprint focuses on project setup, authentication, and product catalog basics.

---

## Tech Stack

- **Backend**: Node.js 20, Express.js 4.x, TypeScript 5.x
- **Database**: PostgreSQL 15, Prisma 5.x ORM
- **Cache**: Redis 7
- **Frontend**: React 18, Vite 5.x, TypeScript, Tailwind CSS
- **State**: Zustand, React Query
- **Auth**: JWT, bcryptjs
- **Validation**: Zod

---

## Project Structure

```
shopflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   ├── prisma/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   └── types/
│   └── tests/
└── docker-compose.yml
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  firstName    String    @map("first_name")
  lastName     String    @map("last_name")
  phone        String?
  role         UserRole  @default(CUSTOMER)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  addresses Address[]
  orders    Order[]
  reviews   Review[]
  carts     Cart[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
  STAFF
}

model Category {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String?
  parentId    String?    @map("parent_id")
  imageUrl    String?    @map("image_url")
  sortOrder   Int        @default(0) @map("sort_order")

  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  products Product[]

  @@index([parentId])
  @@map("categories")
}

model Product {
  id              String   @id @default(uuid())
  sku             String   @unique
  name            String
  slug            String   @unique
  description     String?
  price           Decimal  @db.Decimal(10, 2)
  compareAtPrice  Decimal? @map("compare_at_price") @db.Decimal(10, 2)
  categoryId      String   @map("category_id")
  stockQuantity   Int      @default(0) @map("stock_quantity")
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  category Category       @relation(fields: [categoryId], references: [id])
  images   ProductImage[]
  reviews  Review[]

  @@index([categoryId])
  @@index([isActive, createdAt])
  @@map("products")
}

model ProductImage {
  id        String  @id @default(uuid())
  productId String  @map("product_id")
  url       String
  altText   String? @map("alt_text")
  sortOrder Int     @default(0) @map("sort_order")
  isPrimary Boolean @default(false) @map("is_primary")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}
```

---

## Authentication Endpoints

### POST /api/v1/auth/register

```typescript
// Request
{
  "email": "customer@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"  // optional
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### POST /api/v1/auth/login

```typescript
// Request
{
  "email": "customer@example.com",
  "password": "SecurePass123!"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

## Product Endpoints

### GET /api/v1/products

```typescript
// Query params:
// ?page=1&limit=20&categoryId=xxx&minPrice=10&maxPrice=100&search=shirt&sortBy=price&sortOrder=asc

// Response (200)
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "sku": "SHIRT-001",
        "name": "Classic Cotton T-Shirt",
        "slug": "classic-cotton-t-shirt",
        "description": "Comfortable everyday wear",
        "price": "29.99",
        "compareAtPrice": "39.99",
        "stockQuantity": 150,
        "isActive": true,
        "category": {
          "id": "uuid",
          "name": "T-Shirts",
          "slug": "t-shirts"
        },
        "images": [
          {
            "id": "uuid",
            "url": "https://cdn.shopflow.com/products/shirt-001.jpg",
            "altText": "Classic Cotton T-Shirt - Front",
            "isPrimary": true
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### GET /api/v1/products/:id

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "SHIRT-001",
    "name": "Classic Cotton T-Shirt",
    "slug": "classic-cotton-t-shirt",
    "description": "Comfortable everyday wear...",
    "price": "29.99",
    "compareAtPrice": "39.99",
    "stockQuantity": 150,
    "isActive": true,
    "category": {...},
    "images": [...],
    "averageRating": 4.5,
    "reviewCount": 28
  }
}
```

### POST /api/v1/products (Admin only)

```typescript
// Request
{
  "sku": "DRESS-001",
  "name": "Summer Floral Dress",
  "description": "Beautiful summer dress",
  "price": 79.99,
  "compareAtPrice": 99.99,
  "categoryId": "category-uuid",
  "stockQuantity": 50,
  "images": [
    {
      "url": "https://cdn.shopflow.com/products/dress-001.jpg",
      "altText": "Summer Floral Dress",
      "isPrimary": true
    }
  ]
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "DRESS-001",
    ...
  }
}
```

---

## Category Endpoints

### GET /api/v1/categories

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Clothing",
        "slug": "clothing",
        "imageUrl": "https://cdn.shopflow.com/categories/clothing.jpg",
        "productCount": 245,
        "children": [
          {
            "id": "uuid",
            "name": "T-Shirts",
            "slug": "t-shirts",
            "productCount": 89
          },
          {
            "id": "uuid",
            "name": "Dresses",
            "slug": "dresses",
            "productCount": 56
          }
        ]
      }
    ]
  }
}
```

### GET /api/v1/categories/:id

```typescript
// Response (200) - includes products in category
{
  "success": true,
  "data": {
    "category": {
      "id": "uuid",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Casual and comfortable t-shirts",
      "parent": {
        "id": "uuid",
        "name": "Clothing",
        "slug": "clothing"
      }
    },
    "products": [...],
    "pagination": {...}
  }
}
```

---

## Validation Schemas

```typescript
// src/schemas/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[0-9]/, 'Must contain number'),
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().min(1, 'Last name required'),
    phone: z.string().optional(),
  }),
});

// src/schemas/product.schema.ts
export const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1, 'SKU required'),
    name: z.string().min(1, 'Name required').max(255),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    compareAtPrice: z.number().positive().optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    stockQuantity: z.number().int().min(0).optional(),
    images: z.array(z.object({
      url: z.string().url('Invalid image URL'),
      altText: z.string().optional(),
      isPrimary: z.boolean().optional(),
    })).optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    categoryId: z.string().uuid().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['price', 'name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});
```

---

## Environment Variables

```env
# Backend
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopflow
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

---

## Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: shopflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/shopflow
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Seed Data

```typescript
// prisma/seed.ts
const categories = [
  { name: 'Clothing', slug: 'clothing' },
  { name: 'T-Shirts', slug: 't-shirts', parentSlug: 'clothing' },
  { name: 'Dresses', slug: 'dresses', parentSlug: 'clothing' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Phones', slug: 'phones', parentSlug: 'electronics' },
];

const products = [
  {
    sku: 'SHIRT-001',
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-t-shirt',
    description: 'Comfortable everyday wear',
    price: 29.99,
    categorySlug: 't-shirts',
    stockQuantity: 150,
  },
  // ... more products
];
```

---

## Checklist Before Completing Sprint 0

- [ ] Migrations applied
- [ ] Seed data created
- [ ] Auth endpoints working
- [ ] Product CRUD working
- [ ] Category CRUD working
- [ ] Admin-only routes protected
- [ ] Frontend product listing
- [ ] Frontend product detail
- [ ] Frontend category navigation
- [ ] Tests passing
- [ ] Docker Compose working
