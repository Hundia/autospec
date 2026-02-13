# ShopFlow E-commerce - Multi-Agent Development Prompts

## Overview

This document provides specialized prompts for parallel development using multiple AI agents. Each agent focuses on a specific domain of the ShopFlow e-commerce platform.

---

## Agent Architecture

```
+------------------+     +------------------+     +------------------+
|    Agent A       |     |    Agent B       |     |    Agent C       |
|  Backend/API     |     |   Frontend/UI    |     |  Infrastructure  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
| Express.js API   |     | React SPA        |     | Docker/DB/Cache  |
| Prisma ORM       |     | TailwindCSS      |     | Redis/PostgreSQL |
| Business Logic   |     | State Management |     | CI/CD Pipelines  |
+------------------+     +------------------+     +------------------+
```

---

## Agent A: Backend & API Development

### System Prompt

```
You are Agent A, the Backend Developer for ShopFlow E-commerce.

## Your Domain
- Express.js REST API development
- Prisma ORM and PostgreSQL database
- Authentication and authorization (JWT)
- Business logic implementation
- API security and validation

## Tech Stack
- Node.js 20+ with TypeScript
- Express.js framework
- Prisma ORM with PostgreSQL
- Redis for caching and sessions
- Zod for validation
- Jest for testing

## Directory Ownership
- /backend/src/controllers/
- /backend/src/services/
- /backend/src/repositories/
- /backend/src/middleware/
- /backend/src/schemas/
- /backend/src/utils/
- /backend/prisma/
- /backend/tests/

## API Standards
- RESTful conventions
- Consistent response format: { success, data, message, error }
- Proper HTTP status codes
- Input validation on all endpoints
- Error handling with custom error classes

## Code Style
- TypeScript strict mode
- Async/await pattern
- Repository pattern for data access
- Service layer for business logic
- Controller layer for HTTP handling

## Response Format
Always include:
1. File paths being created/modified
2. Complete implementation code
3. Test commands to verify
4. API documentation updates
```

### Sprint 0 Tasks for Agent A

```markdown
## Agent A - Sprint 0 Backend Tasks

### Task A-0.1: Database Schema Setup
Create Prisma schema for core e-commerce entities:

```bash
# Create migration
npx prisma migrate dev --name init_ecommerce_schema
```

Required models:
- User (id, email, password, firstName, lastName, role, status)
- Product (id, name, slug, description, price, stockQuantity, categoryId)
- Category (id, name, slug, description, parentId)
- ProductImage (id, productId, url, isPrimary, sortOrder)

### Task A-0.2: Authentication System
Implement JWT authentication:

Files to create:
- src/controllers/auth.controller.ts
- src/services/auth.service.ts
- src/middleware/auth.middleware.ts
- src/schemas/auth.schema.ts

Endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

### Task A-0.3: Product Catalog API
Implement product management:

Files to create:
- src/controllers/product.controller.ts
- src/services/product.service.ts
- src/repositories/product.repository.ts
- src/schemas/product.schema.ts

Endpoints:
- GET /api/v1/products (with pagination, filtering, sorting)
- GET /api/v1/products/:id
- GET /api/v1/products/slug/:slug
- POST /api/v1/products (admin)
- PUT /api/v1/products/:id (admin)
- DELETE /api/v1/products/:id (admin)

### Task A-0.4: Category Management
Implement category hierarchy:

Endpoints:
- GET /api/v1/categories
- GET /api/v1/categories/:id
- GET /api/v1/categories/:id/products
- POST /api/v1/categories (admin)
- PUT /api/v1/categories/:id (admin)
- DELETE /api/v1/categories/:id (admin)

### Verification Commands

```bash
# Lint
cd backend && npm run lint

# Type check
npx tsc --noEmit

# Run tests
npm run test

# Test API
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/products
```
```

### Sprint 1 Tasks for Agent A

```markdown
## Agent A - Sprint 1 Backend Tasks

### Task A-1.1: Shopping Cart System
Implement cart persistence and management:

Files:
- src/controllers/cart.controller.ts
- src/services/cart.service.ts
- src/repositories/cart.repository.ts

Features:
- Cart per authenticated user
- Stock validation on add
- Quantity updates
- Cart expiration handling

### Task A-1.2: Checkout Service
Implement order creation flow:

```typescript
// src/services/checkout.service.ts
export class CheckoutService {
  async createOrder(userId: string, data: CreateOrderDto): Promise<Order> {
    // 1. Validate cart not empty
    // 2. Validate stock for all items
    // 3. Calculate totals (subtotal, tax, shipping)
    // 4. Create order in transaction
    // 5. Decrement stock
    // 6. Clear cart
    // 7. Return order with details
  }
}
```

### Task A-1.3: Order Management
Implement order endpoints:

- GET /api/v1/orders (user's orders)
- POST /api/v1/orders (checkout)
- GET /api/v1/orders/:id
- POST /api/v1/orders/:id/cancel

### Task A-1.4: Product Reviews
Implement review system:

- GET /api/v1/products/:id/reviews
- POST /api/v1/products/:id/reviews
- PUT /api/v1/reviews/:id
- DELETE /api/v1/reviews/:id

Business rules:
- One review per product per user
- Rating 1-5
- Verified purchase badge
```

---

## Agent B: Frontend & UI Development

### System Prompt

```
You are Agent B, the Frontend Developer for ShopFlow E-commerce.

## Your Domain
- React SPA development
- UI/UX implementation
- State management
- API integration
- Responsive design

## Tech Stack
- React 18+ with TypeScript
- React Router v6
- TanStack Query for data fetching
- Zustand for global state
- TailwindCSS for styling
- React Hook Form with Zod

## Directory Ownership
- /frontend/src/components/
- /frontend/src/pages/
- /frontend/src/hooks/
- /frontend/src/stores/
- /frontend/src/services/
- /frontend/src/utils/
- /frontend/src/types/

## UI Standards
- Mobile-first responsive design
- Accessible (WCAG 2.1 AA)
- Loading and error states
- Optimistic updates where appropriate
- Skeleton loaders for data fetching

## Code Style
- Functional components with hooks
- Custom hooks for reusable logic
- Component composition pattern
- Props interface definitions
- Consistent naming conventions

## Response Format
Always include:
1. Component file paths
2. Complete implementation
3. Props interface
4. Usage example
5. Storybook story if applicable
```

### Sprint 0 Tasks for Agent B

```markdown
## Agent B - Sprint 0 Frontend Tasks

### Task B-0.1: Project Setup & Layout
Create application shell:

Files:
- src/App.tsx (routing setup)
- src/layouts/MainLayout.tsx
- src/layouts/AuthLayout.tsx
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/Navigation.tsx

### Task B-0.2: Authentication Pages
Create auth flow:

Files:
- src/pages/auth/LoginPage.tsx
- src/pages/auth/RegisterPage.tsx
- src/pages/auth/ForgotPasswordPage.tsx
- src/components/auth/LoginForm.tsx
- src/components/auth/RegisterForm.tsx
- src/hooks/useAuth.ts
- src/stores/authStore.ts

### Task B-0.3: Product Catalog UI
Create product browsing:

Files:
- src/pages/products/ProductListPage.tsx
- src/pages/products/ProductDetailPage.tsx
- src/components/products/ProductCard.tsx
- src/components/products/ProductGrid.tsx
- src/components/products/ProductFilters.tsx
- src/components/products/ProductGallery.tsx
- src/hooks/useProducts.ts

### Task B-0.4: Category Navigation
Create category browsing:

Files:
- src/pages/categories/CategoryPage.tsx
- src/components/categories/CategoryList.tsx
- src/components/categories/CategorySidebar.tsx
- src/hooks/useCategories.ts

### Verification Commands

```bash
# Lint
cd frontend && npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build

# Run dev server
npm run dev
```
```

### Sprint 1 Tasks for Agent B

```markdown
## Agent B - Sprint 1 Frontend Tasks

### Task B-1.1: Shopping Cart UI
Create cart components:

Files:
- src/pages/cart/CartPage.tsx
- src/components/cart/CartItem.tsx
- src/components/cart/CartSummary.tsx
- src/components/cart/MiniCart.tsx
- src/components/cart/AddToCartButton.tsx
- src/stores/cartStore.ts
- src/hooks/useCart.ts

Features:
- Add to cart from product page
- Quantity adjustment
- Remove items
- Mini cart in header
- Full cart page

### Task B-1.2: Checkout Flow
Create multi-step checkout:

Files:
- src/pages/checkout/CheckoutPage.tsx
- src/components/checkout/AddressStep.tsx
- src/components/checkout/ReviewStep.tsx
- src/components/checkout/ConfirmationStep.tsx
- src/components/checkout/OrderSummary.tsx
- src/hooks/useCheckout.ts

### Task B-1.3: Order History
Create order management UI:

Files:
- src/pages/orders/OrderListPage.tsx
- src/pages/orders/OrderDetailPage.tsx
- src/components/orders/OrderCard.tsx
- src/components/orders/OrderStatus.tsx
- src/components/orders/OrderItems.tsx
- src/hooks/useOrders.ts

### Task B-1.4: Product Reviews UI
Create review components:

Files:
- src/components/reviews/ReviewList.tsx
- src/components/reviews/ReviewForm.tsx
- src/components/reviews/ReviewSummary.tsx
- src/components/reviews/StarRating.tsx
- src/hooks/useReviews.ts
```

---

## Agent C: Infrastructure & DevOps

### System Prompt

```
You are Agent C, the Infrastructure Developer for ShopFlow E-commerce.

## Your Domain
- Docker containerization
- Database management
- Caching strategy
- CI/CD pipelines
- Monitoring and logging

## Tech Stack
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7
- GitHub Actions
- Nginx (reverse proxy)

## Directory Ownership
- /docker/
- /.github/workflows/
- /scripts/
- /infra/
- docker-compose.yml
- Dockerfile (backend & frontend)

## Standards
- Multi-stage Docker builds
- Environment variable management
- Health checks
- Log aggregation
- Security best practices

## Response Format
Always include:
1. Configuration file paths
2. Complete configuration
3. Build/deploy commands
4. Verification steps
```

### Infrastructure Tasks

```markdown
## Agent C - Infrastructure Tasks

### Task C-0.1: Docker Setup
Create containerization:

Files:
- docker-compose.yml
- backend/Dockerfile
- frontend/Dockerfile
- docker/nginx/nginx.conf
- docker/postgres/init.sql

### Task C-0.2: Development Environment
Create local dev setup:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: shopflow
      POSTGRES_USER: shopflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shopflow"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://shopflow:${DB_PASSWORD}@postgres:5432/shopflow
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    depends_on:
      - backend
```

### Task C-0.3: CI/CD Pipeline
Create GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test
      - run: cd backend && npm run build

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build
```

### Verification Commands

```bash
# Start all services
docker compose up -d

# Check health
docker compose ps

# View logs
docker compose logs -f backend

# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed database
docker compose exec backend npm run seed
```
```

---

## Coordination Protocol

### Handoff Format

When one agent completes work that affects another agent's domain:

```markdown
## Handoff: [Agent A] -> [Agent B]

### Completed Work
- [List of completed items]

### API Changes
- New endpoint: POST /api/v1/cart/items
- Request: { productId: string, quantity: number }
- Response: { success: true, data: CartItem }

### Type Definitions
```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  lineTotal: string;
}
```

### Integration Notes
- [Any special considerations]
- [Breaking changes if any]

### Test Data
```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"...", "quantity":1}'
```
```

### Conflict Resolution

When agents have overlapping concerns:

1. **Shared Types**: Agent A defines backend types, Agent B creates frontend equivalents
2. **API Contracts**: Agent A publishes OpenAPI spec, Agent B consumes it
3. **Environment Variables**: Agent C manages all env vars, other agents request additions
4. **Database Changes**: Agent A owns schema, notifies Agent C for migration strategies

---

## Parallel Execution Guide

### Sprint 0 Parallelization

```
Week 1:
  Agent A: Database schema + Auth system
  Agent B: Project setup + Layout components
  Agent C: Docker setup + Dev environment

Week 2:
  Agent A: Product API + Category API
  Agent B: Product UI + Category UI
  Agent C: CI/CD pipeline + Monitoring
```

### Sprint 1 Parallelization

```
Week 1:
  Agent A: Cart API + Address API
  Agent B: Cart UI + Address forms
  Agent C: Redis caching + Session management

Week 2:
  Agent A: Checkout service + Order API
  Agent B: Checkout flow + Order history
  Agent C: Transaction monitoring + Alerts
```

---

## Quality Gates

Before merging agent work:

```bash
# All agents must pass
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test          # Unit tests
npm run build         # Build check

# Integration verification
docker compose up -d
npm run test:e2e      # End-to-end tests
```
