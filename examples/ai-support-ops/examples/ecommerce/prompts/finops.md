# ShopFlow E-commerce - FinOps Model Selection Guide

## Overview

This guide helps optimize AI model selection for different development tasks in ShopFlow, balancing cost, speed, and quality.

---

## Model Tiers

| Tier | Model | Cost | Speed | Best For |
|------|-------|------|-------|----------|
| **Economy** | Claude Haiku | $0.25/$1.25 per 1M tokens | Fastest | Simple tasks, boilerplate |
| **Standard** | Claude Sonnet | $3/$15 per 1M tokens | Fast | Most development work |
| **Premium** | Claude Opus | $15/$75 per 1M tokens | Slower | Complex architecture, debugging |

---

## Task-Based Model Selection

### Economy Tier (Haiku) - Simple Tasks

**Use for:**
- Generating boilerplate code
- Writing simple CRUD operations
- Creating test data fixtures
- Writing documentation comments
- Simple refactoring tasks
- Code formatting suggestions

**E-commerce Examples:**

```markdown
## Haiku Task: Generate Product Seed Data

Create 20 product entries for the seed file with realistic
e-commerce data including names, descriptions, prices, and
stock quantities across these categories: Electronics,
Clothing, Home & Garden.

## Haiku Task: Create CartItem Interface

Create a TypeScript interface for CartItem based on this
Prisma model: [paste model]

## Haiku Task: Add JSDoc Comments

Add JSDoc comments to all public methods in the
ProductService class.
```

**Estimated Costs:**
| Task | Input Tokens | Output Tokens | Cost |
|------|--------------|---------------|------|
| Seed data generation | ~500 | ~2,000 | ~$0.003 |
| Interface creation | ~200 | ~300 | ~$0.0005 |
| JSDoc comments | ~1,000 | ~800 | ~$0.001 |

---

### Standard Tier (Sonnet) - Core Development

**Use for:**
- Implementing API endpoints
- Building React components
- Writing unit tests
- Database query optimization
- State management logic
- Form validation
- Error handling

**E-commerce Examples:**

```markdown
## Sonnet Task: Implement Cart Service

Create the CartService with these methods:
- getCart(userId): Get user's cart with items
- addItem(userId, productId, quantity): Add item with stock validation
- updateQuantity(cartItemId, quantity): Update item quantity
- removeItem(cartItemId): Remove item from cart
- clearCart(userId): Clear all items

Include proper error handling and input validation.

## Sonnet Task: Build Product Card Component

Create a ProductCard component with:
- Product image with lazy loading
- Name, price, and rating display
- Add to cart button with quantity selector
- Sale badge for discounted items
- Loading skeleton state
- Responsive design (mobile/desktop)

## Sonnet Task: Write Checkout Tests

Write comprehensive tests for the CheckoutService:
- Test order creation from cart
- Test stock validation
- Test total calculation (subtotal, tax, shipping)
- Test cart clearing after checkout
- Test error cases (empty cart, insufficient stock)
```

**Estimated Costs:**
| Task | Input Tokens | Output Tokens | Cost |
|------|--------------|---------------|------|
| Cart service | ~1,500 | ~3,000 | ~$0.05 |
| Product card | ~1,000 | ~2,500 | ~$0.04 |
| Checkout tests | ~2,000 | ~4,000 | ~$0.07 |

---

### Premium Tier (Opus) - Complex Tasks

**Use for:**
- System architecture decisions
- Complex debugging sessions
- Performance optimization
- Security review
- Database schema design
- Multi-service integration
- Code review with explanations

**E-commerce Examples:**

```markdown
## Opus Task: Design Checkout Architecture

Design the checkout flow architecture considering:
- Cart validation and stock reservation
- Address management
- Order creation with transaction handling
- Stock decrement atomicity
- Payment integration preparation
- Error recovery and rollback
- Concurrent checkout handling
- Performance under load

Provide:
1. Sequence diagrams
2. Service interfaces
3. Database transaction strategy
4. Error handling approach
5. Testing strategy

## Opus Task: Debug Order Race Condition

We're seeing duplicate orders when users double-click checkout.
Current code: [paste checkout service]
Database schema: [paste order schema]

Analyze the race condition and provide:
1. Root cause analysis
2. Solution options with tradeoffs
3. Recommended implementation
4. Test cases to prevent regression

## Opus Task: Optimize Product Search

Product search is slow (>2s) with 100k products.
Current implementation: [paste code]
Database indexes: [paste indexes]
Query explain: [paste explain output]

Provide:
1. Performance analysis
2. Query optimization
3. Caching strategy
4. Pagination improvements
5. Full-text search consideration
```

**Estimated Costs:**
| Task | Input Tokens | Output Tokens | Cost |
|------|--------------|---------------|------|
| Architecture design | ~3,000 | ~8,000 | ~$0.65 |
| Debug session | ~5,000 | ~6,000 | ~$0.53 |
| Query optimization | ~4,000 | ~5,000 | ~$0.44 |

---

## Sprint Cost Estimates

### Sprint 0: Foundation

| Task Category | Model | Tasks | Est. Cost |
|---------------|-------|-------|-----------|
| Schema design | Opus | 1 | $0.50 |
| Auth implementation | Sonnet | 4 | $0.20 |
| Product CRUD | Sonnet | 6 | $0.30 |
| Category CRUD | Sonnet | 4 | $0.20 |
| React setup | Sonnet | 3 | $0.15 |
| UI components | Sonnet | 10 | $0.50 |
| Seed data | Haiku | 3 | $0.01 |
| Tests | Sonnet | 8 | $0.40 |
| Documentation | Haiku | 5 | $0.02 |

**Sprint 0 Total: ~$2.30**

### Sprint 1: Shopping Features

| Task Category | Model | Tasks | Est. Cost |
|---------------|-------|-------|-----------|
| Cart system design | Opus | 1 | $0.50 |
| Cart implementation | Sonnet | 5 | $0.25 |
| Checkout architecture | Opus | 1 | $0.65 |
| Checkout implementation | Sonnet | 6 | $0.30 |
| Order management | Sonnet | 5 | $0.25 |
| Reviews system | Sonnet | 4 | $0.20 |
| Cart UI | Sonnet | 6 | $0.30 |
| Checkout UI | Sonnet | 8 | $0.40 |
| Order UI | Sonnet | 5 | $0.25 |
| Tests | Sonnet | 12 | $0.60 |
| Bug fixes | Opus | 2 | $0.80 |

**Sprint 1 Total: ~$4.50**

---

## Cost Optimization Strategies

### 1. Prompt Reuse

Create template prompts for common patterns:

```markdown
## Template: CRUD Controller

Create a controller for [ENTITY] with standard CRUD operations:
- GET /api/v1/[entities] - List with pagination
- GET /api/v1/[entities]/:id - Get by ID
- POST /api/v1/[entities] - Create (admin)
- PUT /api/v1/[entities]/:id - Update (admin)
- DELETE /api/v1/[entities]/:id - Delete (admin)

Follow the existing controller patterns in the codebase.
```

### 2. Batch Similar Tasks

Instead of:
```
Task 1: Create CartItem interface
Task 2: Create OrderItem interface
Task 3: Create ReviewItem interface
```

Combine:
```
Create TypeScript interfaces for: CartItem, OrderItem, ReviewItem
based on their respective Prisma models.
```

### 3. Incremental Context

Start with minimal context, add only if needed:

```markdown
## Level 1 (Haiku)
Create a React component for displaying product price with
sale formatting.

## Level 2 (Sonnet) - if Level 1 insufficient
Create a React component for displaying product price.
Requirements:
- Show original price and sale price
- Calculate discount percentage
- Format currency
- Handle missing prices gracefully
```

### 4. Model Escalation Pattern

```
1. Try Haiku first for simple tasks
2. If output quality insufficient, retry with Sonnet
3. Only use Opus for genuinely complex problems
```

---

## E-commerce Specific Guidelines

### Product Catalog Tasks

| Task | Recommended Model |
|------|-------------------|
| Product list component | Sonnet |
| Product filters | Sonnet |
| Search autocomplete | Sonnet |
| Category tree | Sonnet |
| Image gallery | Sonnet |
| SEO optimization | Opus |

### Shopping Cart Tasks

| Task | Recommended Model |
|------|-------------------|
| Add to cart button | Haiku |
| Cart item display | Sonnet |
| Quantity updates | Sonnet |
| Stock validation | Sonnet |
| Cart persistence | Opus |
| Guest cart merge | Opus |

### Checkout Tasks

| Task | Recommended Model |
|------|-------------------|
| Address form | Sonnet |
| Order summary | Sonnet |
| Price calculation | Sonnet |
| Transaction handling | Opus |
| Error recovery | Opus |
| Payment prep | Opus |

### Order Management Tasks

| Task | Recommended Model |
|------|-------------------|
| Order list | Sonnet |
| Order details | Sonnet |
| Status display | Haiku |
| Cancel logic | Sonnet |
| Refund handling | Opus |

---

## Budget Tracking Template

```markdown
## Sprint Budget Tracker

**Budget**: $10.00
**Spent**: $0.00
**Remaining**: $10.00

### Daily Log

| Date | Task | Model | Tokens | Cost | Running Total |
|------|------|-------|--------|------|---------------|
| Day 1 | Schema design | Opus | 11k | $0.50 | $0.50 |
| Day 1 | Auth controller | Sonnet | 4k | $0.06 | $0.56 |
| Day 1 | Auth tests | Sonnet | 5k | $0.08 | $0.64 |
| Day 2 | Product service | Sonnet | 6k | $0.10 | $0.74 |
| ... | ... | ... | ... | ... | ... |

### Weekly Summary

| Week | Haiku | Sonnet | Opus | Total |
|------|-------|--------|------|-------|
| Week 1 | $0.05 | $1.50 | $1.00 | $2.55 |
| Week 2 | $0.03 | $1.80 | $0.80 | $2.63 |
```

---

## ROI Considerations

### When Premium (Opus) Pays Off

1. **Architecture decisions** - Getting it right saves refactoring
2. **Security review** - Catching vulnerabilities early
3. **Performance bugs** - Hours of debugging vs. 1 query
4. **Complex integrations** - Payment, shipping, inventory

### When Economy (Haiku) Suffices

1. **Boilerplate** - DTOs, interfaces, types
2. **Repetitive code** - Similar components, test fixtures
3. **Documentation** - Comments, README updates
4. **Simple refactoring** - Rename, restructure

### Cost vs. Developer Time

| Scenario | AI Cost | Dev Time Saved | Hourly Rate | Value |
|----------|---------|----------------|-------------|-------|
| Complex debug | $0.50 | 2 hours | $75 | $149.50 |
| CRUD endpoint | $0.05 | 30 min | $75 | $37.45 |
| Component | $0.04 | 20 min | $75 | $24.96 |
| Architecture | $0.65 | 4 hours | $75 | $299.35 |

---

## Quick Reference Card

```
+------------------+-------------------+------------------+
|     HAIKU        |      SONNET       |      OPUS        |
|   (Economy)      |    (Standard)     |    (Premium)     |
+------------------+-------------------+------------------+
| - Seed data      | - API endpoints   | - Architecture   |
| - Interfaces     | - Components      | - Debugging      |
| - Types/DTOs     | - Unit tests      | - Security       |
| - JSDoc          | - State logic     | - Performance    |
| - Boilerplate    | - Validation      | - Integration    |
| - Formatting     | - Error handling  | - Code review    |
+------------------+-------------------+------------------+
| ~$0.001/task     | ~$0.05/task       | ~$0.50/task      |
+------------------+-------------------+------------------+
```
