# Sprint 1 Planning Guide: Core Shopping Experience

## Environment: claude-code

## Sprint Overview
- **Goal:** Enable users to browse products, manage cart, and complete basic checkout.
- **Duration:** 2 weeks
- **Total Tickets:** 52
- **Total Story Points:** 165
- **Dependencies:** Sprint 0 complete (authentication system)

## Pre-Sprint Checklist
- [ ] Sprint 0 fully complete and QA passed
- [ ] Authentication system working (register, login, refresh)
- [ ] Database running with users table populated
- [ ] Redis running for session management
- [ ] Stripe test account configured (for payment)
- [ ] All spec files reviewed for Sprint 1 features

## Tickets Overview

### Database Migrations (SF-026 to SF-030) - 10 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-026 | Create categories table migration | Backend | Haiku | 2 | SF-005 |
| SF-027 | Create brands table migration | Backend | Haiku | 2 | SF-005 |
| SF-028 | Create products table migration | Backend | Sonnet | 2 | SF-026, SF-027 |
| SF-029 | Create product_variants table migration | Backend | Haiku | 2 | SF-028 |
| SF-030 | Create product_images table migration | Backend | Haiku | 2 | SF-028 |

### Product API (SF-031 to SF-035) - 15 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-031 | Implement GET /products with pagination | Backend | Sonnet | 3 | SF-028 |
| SF-032 | Implement product filtering | Backend | Sonnet | 3 | SF-031 |
| SF-033 | Implement product sorting | Backend | Sonnet | 3 | SF-031 |
| SF-034 | Implement GET /products/:id | Backend | Sonnet | 3 | SF-028 |
| SF-035 | Implement GET /categories | Backend | Haiku | 3 | SF-026 |

### Cart API (SF-036 to SF-040) - 15 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-036 | Create carts and cart_items tables | Backend | Sonnet | 3 | SF-005, SF-028 |
| SF-037 | Implement GET /cart | Backend | Sonnet | 3 | SF-036 |
| SF-038 | Implement POST /cart/items | Backend | Sonnet | 3 | SF-036 |
| SF-039 | Implement PATCH /cart/items/:id | Backend | Sonnet | 3 | SF-036 |
| SF-040 | Implement DELETE /cart/items/:id | Backend | Haiku | 3 | SF-036 |

### Base UI Components (SF-041 to SF-045) - 15 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-041 | Build Button component | Frontend | Haiku | 3 | SF-001 |
| SF-042 | Build Input component with validation | Frontend | Sonnet | 3 | SF-001 |
| SF-043 | Build Card component | Frontend | Haiku | 3 | SF-001 |
| SF-044 | Build Header component | Frontend | Sonnet | 3 | SF-041, SF-043 |
| SF-045 | Build Footer component | Frontend | Haiku | 3 | SF-001 |

### Product Components (SF-046 to SF-050) - 20 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-046 | Build ProductCard component | Frontend | Sonnet | 4 | SF-043 |
| SF-047 | Build ProductGrid component | Frontend | Sonnet | 4 | SF-046 |
| SF-048 | Build ProductFilters component | Frontend | Sonnet | 4 | SF-041, SF-042 |
| SF-049 | Build Product Listing Page (PLP) | Frontend | Sonnet | 4 | SF-044, SF-045, SF-047, SF-048 |
| SF-050 | Integrate PLP with products API | Frontend | Sonnet | 4 | SF-031, SF-049 |

### Product Detail (SF-051 to SF-054) - 15 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-051 | Build ProductGallery component | Frontend | Sonnet | 4 | SF-001 |
| SF-052 | Build ProductInfo component | Frontend | Sonnet | 4 | SF-041, SF-042 |
| SF-053 | Build Product Detail Page (PDP) | Frontend | Sonnet | 4 | SF-044, SF-045, SF-051, SF-052 |
| SF-054 | Integrate PDP with product API | Frontend | Sonnet | 3 | SF-034, SF-053 |

### Cart Components (SF-055 to SF-059) - 15 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-055 | Create Zustand cart store | Frontend | Sonnet | 3 | SF-001 |
| SF-056 | Build CartItem component | Frontend | Sonnet | 3 | SF-041 |
| SF-057 | Build CartSidebar component | Frontend | Sonnet | 3 | SF-055, SF-056 |
| SF-058 | Build Cart Page | Frontend | Sonnet | 3 | SF-044, SF-045, SF-055, SF-056 |
| SF-059 | Integrate cart with backend API | Frontend | Sonnet | 3 | SF-037, SF-038, SF-039, SF-040, SF-055 |

### Checkout Backend (SF-060 to SF-066) - 25 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-060 | Create orders and order_items tables | Backend | Sonnet | 4 | SF-005, SF-006 |
| SF-061 | Create order_addresses table | Backend | Haiku | 3 | SF-060 |
| SF-062 | Create payments table | Backend | Sonnet | 3 | SF-060 |
| SF-063 | Implement POST /checkout/session | Backend | Opus | 5 | SF-036, SF-060 |
| SF-064 | Implement PATCH /checkout/:id/shipping | Backend | Sonnet | 3 | SF-063 |
| SF-065 | Implement POST /checkout/:id/payment | Backend | Opus | 4 | SF-063, SF-062 |
| SF-066 | Implement POST /checkout/:id/complete | Backend | Opus | 3 | SF-063, SF-062 |

### Checkout Frontend (SF-067 to SF-076) - 30 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-067 | Build AddressForm component | Frontend | Sonnet | 3 | SF-042 |
| SF-068 | Build ShippingMethodSelector | Frontend | Sonnet | 3 | SF-041 |
| SF-069 | Build PaymentForm (Stripe) | Frontend | Opus | 4 | SF-042 |
| SF-070 | Build CheckoutSteps indicator | Frontend | Haiku | 2 | SF-001 |
| SF-071 | Build Checkout Information page | Frontend | Sonnet | 3 | SF-067, SF-070 |
| SF-072 | Build Checkout Shipping page | Frontend | Sonnet | 3 | SF-068, SF-070 |
| SF-073 | Build Checkout Payment page | Frontend | Sonnet | 3 | SF-069, SF-070 |
| SF-074 | Build Checkout Review page | Frontend | Sonnet | 3 | SF-070 |
| SF-075 | Build Order Confirmation page | Frontend | Sonnet | 3 | SF-044, SF-045 |
| SF-076 | Integrate checkout with backend | Frontend | Sonnet | 3 | SF-063-066, SF-071-074 |

### E2E Test (SF-077) - 5 points
| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-077 | Write E2E test for purchase flow | QA | Sonnet | 5 | SF-076 |

## Execution Order

### Phase 1: Database & API Foundation (Days 1-3)
**Backend Focus - Can run in parallel with Phase 2**

1. **SF-026** - Categories table
2. **SF-027** - Brands table
3. **SF-028** - Products table (depends on 026, 027)
4. **SF-029** - Product variants table
5. **SF-030** - Product images table
6. **SF-031** - GET /products with pagination
7. **SF-032** - Product filtering
8. **SF-033** - Product sorting
9. **SF-034** - GET /products/:id
10. **SF-035** - GET /categories

### Phase 2: Base UI Components (Days 1-2)
**Frontend Focus - Can run in parallel with Phase 1**

1. **SF-041** - Button component
2. **SF-042** - Input component
3. **SF-043** - Card component
4. **SF-044** - Header component
5. **SF-045** - Footer component

### Phase 3: Product Display (Days 3-5)
1. **SF-046** - ProductCard component
2. **SF-047** - ProductGrid component
3. **SF-048** - ProductFilters component
4. **SF-049** - Product Listing Page
5. **SF-050** - PLP API integration
6. **SF-051** - ProductGallery component
7. **SF-052** - ProductInfo component
8. **SF-053** - Product Detail Page
9. **SF-054** - PDP API integration

### Phase 4: Cart System (Days 5-7)
**Backend and Frontend in parallel**

Backend:
1. **SF-036** - Cart tables
2. **SF-037** - GET /cart
3. **SF-038** - POST /cart/items
4. **SF-039** - PATCH /cart/items/:id
5. **SF-040** - DELETE /cart/items/:id

Frontend:
1. **SF-055** - Cart store
2. **SF-056** - CartItem component
3. **SF-057** - CartSidebar component
4. **SF-058** - Cart Page
5. **SF-059** - Cart API integration

### Phase 5: Checkout System (Days 7-12)

Backend:
1. **SF-060** - Orders tables
2. **SF-061** - Order addresses table
3. **SF-062** - Payments table
4. **SF-063** - POST /checkout/session
5. **SF-064** - PATCH /checkout/:id/shipping
6. **SF-065** - POST /checkout/:id/payment
7. **SF-066** - POST /checkout/:id/complete

Frontend:
1. **SF-067** - AddressForm component
2. **SF-068** - ShippingMethodSelector
3. **SF-069** - PaymentForm (Stripe)
4. **SF-070** - CheckoutSteps indicator
5. **SF-071** - Checkout Information page
6. **SF-072** - Checkout Shipping page
7. **SF-073** - Checkout Payment page
8. **SF-074** - Checkout Review page
9. **SF-075** - Order Confirmation page
10. **SF-076** - Checkout API integration

### Phase 6: Testing (Days 12-14)
1. **SF-077** - E2E test for complete purchase flow

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing
- [ ] Integration tests (if applicable)
- [ ] Code follows coding-standards.md
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Committed with message: "Complete SF-XXX: [description]"
- [ ] Backlog status updated to Done

### Sprint DoD
Sprint 1 is COMPLETE when:
- [ ] All 52 tickets show Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] E2E purchase flow test passes
- [ ] Can browse products in browser
- [ ] Can add items to cart
- [ ] Can complete checkout flow
- [ ] QA review complete (see qa_sprint_1.md)
- [ ] Sprint summary created (see summary_sprint_1.md)

## Model Selection Guide (FinOps)

| Complexity | Model | Tickets | Percentage |
|------------|-------|---------|------------|
| Simple (config, migrations, basic UI) | Haiku | 12 | 23% |
| Standard (API endpoints, components) | Sonnet | 37 | 71% |
| Complex (payments, security) | Opus | 3 | 6% |

### Opus Recommended For:
- SF-063: Checkout session creation (complex cart-to-order logic)
- SF-065: Payment processing (Stripe integration, security)
- SF-069: PaymentForm with Stripe Elements (PCI compliance)

## Risk Assessment

### Blockers
- Stripe account must be configured before payment testing
- Product seed data needed for frontend development
- Sprint 0 auth must work for protected checkout routes

### Complexity Areas
- **High:** Payment integration (SF-065, SF-069)
- **Medium:** Checkout flow state management
- **Low:** Basic CRUD operations

### Integration Points
- Products API <-> Product pages
- Cart API <-> Cart store <-> Cart UI
- Checkout API <-> Checkout flow <-> Stripe
- Auth middleware <-> Protected routes

## Seed Data Required

Before starting frontend work, seed the database:

```sql
-- Categories
INSERT INTO categories (id, name, slug) VALUES
  ('cat-1', 'Electronics', 'electronics'),
  ('cat-2', 'Clothing', 'clothing'),
  ('cat-3', 'Home & Garden', 'home-garden');

-- Brands
INSERT INTO brands (id, name, slug) VALUES
  ('brand-1', 'Apple', 'apple'),
  ('brand-2', 'Samsung', 'samsung'),
  ('brand-3', 'Nike', 'nike');

-- Products (10-20 sample products)
-- See docs/testing/test-data.md for full seed script
```

## Next Steps

1. Run `dev_sprint_1.md` prompt to execute development
2. After development, run `qa_sprint_1.md` for QA testing
3. Finally, run `summary_sprint_1.md` to generate sprint documentation
