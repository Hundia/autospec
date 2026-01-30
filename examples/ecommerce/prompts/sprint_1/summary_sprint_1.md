# ShopFlow E-commerce - Sprint 1 Summary Generation Prompt

## Overview

Use this prompt to generate the Sprint 1 summary document.

---

## Sprint Summary Template

```markdown
# ShopFlow E-commerce - Sprint 1 Summary

**Sprint**: 1 - Shopping Cart & Checkout
**Duration**: [Start Date] - [End Date]
**Status**: [Completed / Partially Completed]
**Previous Sprint**: Sprint 0 (sprint-0-complete)

## Features Delivered

### Shopping Cart
- Add products to cart
- Update item quantities
- Remove items from cart
- Clear cart
- Cart persistence for logged-in users
- Stock validation

### Address Management
- Create shipping/billing addresses
- List user addresses
- Update addresses
- Delete addresses
- Default address support

### Checkout & Orders
- Create order from cart
- Order number generation
- Subtotal, tax, shipping calculation
- Stock reduction on checkout
- Cart clearing on checkout
- Order cancellation

### Product Reviews
- Add product reviews (1-5 stars)
- List reviews with summary
- Update own reviews
- Delete own reviews
- Verified purchase badge
- One review per product per user

### Endpoints Implemented

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/cart | View cart |
| POST | /api/v1/cart/items | Add to cart |
| PUT | /api/v1/cart/items/:id | Update quantity |
| DELETE | /api/v1/cart/items/:id | Remove item |
| DELETE | /api/v1/cart | Clear cart |
| GET | /api/v1/addresses | List addresses |
| POST | /api/v1/addresses | Create address |
| PUT | /api/v1/addresses/:id | Update address |
| DELETE | /api/v1/addresses/:id | Delete address |
| GET | /api/v1/orders | List orders |
| POST | /api/v1/orders | Create order |
| GET | /api/v1/orders/:id | Order details |
| POST | /api/v1/orders/:id/cancel | Cancel order |
| GET | /api/v1/products/:id/reviews | List reviews |
| POST | /api/v1/products/:id/reviews | Add review |
| PUT | /api/v1/reviews/:id | Update review |
| DELETE | /api/v1/reviews/:id | Delete review |

## Database Changes

### New Tables
- `carts` - Shopping cart storage
- `cart_items` - Cart item storage
- `addresses` - User addresses
- `orders` - Order records
- `order_items` - Order line items
- `reviews` - Product reviews

## Technical Metrics

| Metric | Value |
|--------|-------|
| New Endpoints | 17 |
| New Database Tables | 6 |
| Test Coverage | XX% |

## Sign-Off

### Git Tag

```bash
git tag -a sprint-1-complete -m "Sprint 1 Complete: Shopping Cart & Checkout

Features:
- Shopping cart (CRUD, stock validation)
- Address management (shipping/billing)
- Checkout flow (order creation, totals)
- Order management (list, detail, cancel)
- Product reviews (CRUD, ratings)

New Endpoints: 17
New Database Tables: 6
Test Coverage: XX%

Regression: All Sprint 0 tests passing
"

git push origin sprint-1-complete
```
```

---

## Next Sprint Preview

### Sprint 2 Potential Focus
1. Payment integration (Stripe)
2. Order status tracking
3. Email notifications
4. Wishlist functionality
5. Product variants (size, color)
6. Inventory management
7. Shipping integration
8. Discount codes/coupons
