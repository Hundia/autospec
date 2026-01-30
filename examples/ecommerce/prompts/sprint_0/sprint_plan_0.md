# ShopFlow E-commerce - Sprint 0 Planning Guide

## Sprint Overview

**Sprint**: 0 - Foundation & Core Setup
**Duration**: 1-2 weeks
**Focus**: Project scaffolding, authentication, product catalog basics

---

## Sprint Goals

1. Set up project infrastructure (frontend + backend + database)
2. Implement user authentication (register, login, JWT)
3. Create product catalog foundation (CRUD, categories)
4. Establish testing framework and CI/CD pipeline

---

## User Stories

### US-0.1: Project Setup
**As a** developer
**I want** a fully configured development environment
**So that** I can start building the e-commerce platform

**Acceptance Criteria:**
- [ ] Backend Express.js project with TypeScript
- [ ] Frontend React project with Vite + TypeScript
- [ ] PostgreSQL database with Prisma ORM
- [ ] Redis for caching
- [ ] Docker Compose for local development
- [ ] ESLint + Prettier configured

### US-0.2: User Authentication
**As a** customer
**I want** to create an account and log in
**So that** I can shop and track my orders

**Acceptance Criteria:**
- [ ] Registration: `POST /api/v1/auth/register`
- [ ] Login: `POST /api/v1/auth/login`
- [ ] JWT access token (1h) + refresh token (7d)
- [ ] User roles: customer, admin, staff
- [ ] Password requirements enforced

### US-0.3: Product Catalog
**As a** customer
**I want** to browse products
**So that** I can find items to purchase

**Acceptance Criteria:**
- [ ] List products: `GET /api/v1/products`
- [ ] Get product: `GET /api/v1/products/:id`
- [ ] Product has: name, description, price, images, category
- [ ] Pagination and basic filtering
- [ ] Admin can create/update/delete products

### US-0.4: Category Management
**As a** customer
**I want** to browse products by category
**So that** I can find items more easily

**Acceptance Criteria:**
- [ ] List categories: `GET /api/v1/categories`
- [ ] Hierarchical categories (parent/child)
- [ ] Products belong to categories
- [ ] Filter products by category

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-0.1 | Initialize Express.js with TypeScript | 2h | P0 |
| BE-0.2 | Configure Prisma with PostgreSQL | 2h | P0 |
| BE-0.3 | Configure Redis client | 1h | P0 |
| BE-0.4 | Create User model and migration | 1h | P0 |
| BE-0.5 | Create Product model and migration | 1h | P0 |
| BE-0.6 | Create Category model and migration | 1h | P0 |
| BE-0.7 | Implement auth middleware (JWT) | 3h | P0 |
| BE-0.8 | Implement auth routes | 4h | P0 |
| BE-0.9 | Implement product CRUD routes | 4h | P0 |
| BE-0.10 | Implement category routes | 2h | P0 |
| BE-0.11 | Add request validation (Zod) | 2h | P1 |
| BE-0.12 | Write tests | 6h | P1 |

### Frontend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| FE-0.1 | Initialize React with Vite | 1h | P0 |
| FE-0.2 | Configure Tailwind CSS | 1h | P0 |
| FE-0.3 | Set up React Router | 1h | P0 |
| FE-0.4 | Create auth pages | 4h | P0 |
| FE-0.5 | Create product listing page | 4h | P0 |
| FE-0.6 | Create product detail page | 3h | P0 |
| FE-0.7 | Create category navigation | 2h | P0 |
| FE-0.8 | Set up React Query | 2h | P1 |

---

## API Endpoints Summary

### Authentication
```
POST   /api/v1/auth/register   - Create account
POST   /api/v1/auth/login      - Login
POST   /api/v1/auth/refresh    - Refresh token
GET    /api/v1/auth/me         - Get current user
```

### Products
```
GET    /api/v1/products        - List products (paginated)
GET    /api/v1/products/:id    - Get product details
POST   /api/v1/products        - Create product (admin)
PUT    /api/v1/products/:id    - Update product (admin)
DELETE /api/v1/products/:id    - Delete product (admin)
```

### Categories
```
GET    /api/v1/categories      - List categories
GET    /api/v1/categories/:id  - Get category with products
POST   /api/v1/categories      - Create category (admin)
PUT    /api/v1/categories/:id  - Update category (admin)
DELETE /api/v1/categories/:id  - Delete category (admin)
```

---

## Database Schema

### Users
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  firstName    String   @map("first_name")
  lastName     String   @map("last_name")
  phone        String?
  role         UserRole @default(CUSTOMER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum UserRole {
  CUSTOMER
  ADMIN
  STAFF
}
```

### Products
```prisma
model Product {
  id             String   @id @default(uuid())
  sku            String   @unique
  name           String
  slug           String   @unique
  description    String?
  price          Decimal  @db.Decimal(10, 2)
  compareAtPrice Decimal? @map("compare_at_price")
  categoryId     String   @map("category_id")
  stockQuantity  Int      @default(0)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  category Category @relation(fields: [categoryId], references: [id])
  images   ProductImage[]
}
```

### Categories
```prisma
model Category {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String?
  parentId    String?    @map("parent_id")
  imageUrl    String?    @map("image_url")
  sortOrder   Int        @default(0)

  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  products Product[]
}
```

---

## Definition of Done (DoD)

### Code Quality
- [ ] ESLint passes
- [ ] Prettier formatting
- [ ] No TypeScript errors
- [ ] Code reviewed

### Testing
- [ ] Unit tests (>70% coverage)
- [ ] Integration tests for API
- [ ] Manual testing completed

### Documentation
- [ ] API endpoints documented
- [ ] README with setup instructions

### Deployment
- [ ] CI pipeline passes
- [ ] Docker Compose works

---

## Sprint 0 Success Criteria

1. **Working Authentication**
   - Customers can register and login
   - Admin users can be created
   - JWT tokens work properly

2. **Product Catalog**
   - Products displayed with images
   - Category filtering works
   - Pagination works

3. **Admin Functions**
   - Admins can manage products
   - Admins can manage categories
