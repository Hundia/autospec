# ShopFlow - QA Lead Specification

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Quality Assurance

---

## 1. Testing Strategy Overview

### 1.1 Testing Philosophy

**Guiding Principles:**
- Test early, test often
- Shift-left testing approach
- Automate repeatable tests
- Risk-based test prioritization
- Continuous quality feedback

### 1.2 Test Pyramid

```
                    /\
                   /  \
                  / E2E \        5% - Critical paths
                 /--------\
                /          \
               / Integration \   15% - API & component
              /--------------\
             /                \
            /      Unit        \  80% - Functions & logic
           /--------------------\
```

### 1.3 Testing Levels

| Level | Scope | Tools | Coverage Target |
|-------|-------|-------|-----------------|
| Unit | Functions, classes, hooks | Jest | 80% |
| Integration | API endpoints, components | Jest, Supertest | 70% |
| E2E | User flows | Playwright | Critical paths |
| Performance | Load, stress | k6 | Baseline metrics |
| Security | Vulnerabilities | OWASP ZAP, npm audit | High/Critical |

---

## 2. Unit Testing Standards

### 2.1 Test File Organization

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx    # Component tests
│       └── Button.stories.tsx # Storybook
├── hooks/
│   └── useCart/
│       ├── useCart.ts
│       └── useCart.test.ts    # Hook tests
├── services/
│   └── products/
│       ├── products.ts
│       └── products.test.ts   # Service tests
└── utils/
    └── formatters/
        ├── formatters.ts
        └── formatters.test.ts # Utility tests
```

### 2.2 Test Naming Conventions

```typescript
describe('ComponentName', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});

// Examples:
describe('CartItem', () => {
  describe('when quantity is updated', () => {
    it('should call onUpdateQuantity with new value', () => {});
    it('should display loading state while updating', () => {});
    it('should show error toast on failure', () => {});
  });

  describe('when item is out of stock', () => {
    it('should display out of stock badge', () => {});
    it('should disable quantity increment button', () => {});
  });
});
```

### 2.3 Unit Test Patterns

#### Testing React Components

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 'prod_123',
    name: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    compareAtPrice: 129.99,
    image: '/test-image.jpg',
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
  };

  it('should render product name and price', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should show sale badge when compareAtPrice exists', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('$129.99', { className: /line-through/ })).toBeInTheDocument();
  });

  it('should navigate to product page on click', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    await user.click(screen.getByRole('link'));

    expect(window.location.pathname).toBe('/products/test-product');
  });

  it('should show out of stock overlay when not in stock', () => {
    render(<ProductCard product={{ ...mockProduct, inStock: false }} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });
});
```

#### Testing Custom Hooks

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCart } from './useCart';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch cart on mount', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cart).toBeDefined();
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.addItem('prod_123', 'var_abc', 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
  });

  it('should update item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    // Setup: add item first
    await act(async () => {
      await result.current.addItem('prod_123', 'var_abc', 1);
    });

    // Test: update quantity
    await act(async () => {
      await result.current.updateQuantity('item_001', 5);
    });

    expect(result.current.cart.items[0].quantity).toBe(5);
  });

  it('should calculate total correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.addItem('prod_123', null, 2); // $99.99 each
    });

    expect(result.current.cart.subtotal).toBe(199.98);
  });
});
```

#### Testing Utility Functions

```typescript
import { formatPrice, formatDate, calculateDiscount, validateEmail } from './formatters';

describe('formatPrice', () => {
  it('should format price with USD currency', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
    expect(formatPrice(1000)).toBe('$1,000.00');
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle different currencies', () => {
    expect(formatPrice(99.99, 'EUR')).toBe('€99.99');
    expect(formatPrice(99.99, 'GBP')).toBe('£99.99');
  });

  it('should handle negative values', () => {
    expect(formatPrice(-50)).toBe('-$50.00');
  });
});

describe('calculateDiscount', () => {
  it('should calculate percentage discount', () => {
    expect(calculateDiscount(100, { type: 'percentage', value: 10 })).toBe(10);
    expect(calculateDiscount(100, { type: 'percentage', value: 25 })).toBe(25);
  });

  it('should calculate fixed amount discount', () => {
    expect(calculateDiscount(100, { type: 'fixed_amount', value: 15 })).toBe(15);
  });

  it('should not exceed order total', () => {
    expect(calculateDiscount(50, { type: 'fixed_amount', value: 100 })).toBe(50);
  });

  it('should respect maximum discount', () => {
    expect(calculateDiscount(200, { type: 'percentage', value: 50, maxDiscount: 30 })).toBe(30);
  });
});

describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
  });
});
```

### 2.4 Mocking Patterns

```typescript
// Mock API calls
jest.mock('@/services/api', () => ({
  productsService: {
    getProducts: jest.fn().mockResolvedValue({ products: [], pagination: {} }),
    getProduct: jest.fn().mockResolvedValue({ id: 'prod_123', name: 'Test' }),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/products',
}));

// Mock Zustand store
jest.mock('@/stores/cart', () => ({
  useCartStore: () => ({
    cart: { items: [], subtotal: 0 },
    addItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));
```

---

## 3. Integration Testing Standards

### 3.1 API Integration Tests

```typescript
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createTestUser, createTestProduct } from '@/test/factories';

describe('Products API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  describe('GET /api/v1/products', () => {
    it('should return paginated products', async () => {
      // Arrange
      await createTestProduct({ name: 'Product 1' });
      await createTestProduct({ name: 'Product 2' });

      // Act
      const response = await request(app)
        .get('/api/v1/products')
        .query({ page: 1, limit: 10 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination.totalItems).toBe(2);
    });

    it('should filter products by category', async () => {
      const category = await prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } });
      await createTestProduct({ name: 'Phone', categoryId: category.id });
      await createTestProduct({ name: 'Shirt', categoryId: null });

      const response = await request(app)
        .get('/api/v1/products')
        .query({ category: 'electronics' });

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toBe('Phone');
    });

    it('should filter products by price range', async () => {
      await createTestProduct({ name: 'Cheap', price: 10 });
      await createTestProduct({ name: 'Mid', price: 50 });
      await createTestProduct({ name: 'Expensive', price: 200 });

      const response = await request(app)
        .get('/api/v1/products')
        .query({ minPrice: 25, maxPrice: 100 });

      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toBe('Mid');
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return product by ID', async () => {
      const product = await createTestProduct({ name: 'Test Product' });

      const response = await request(app)
        .get(`/api/v1/products/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/v1/products/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});

describe('Cart API', () => {
  let user;
  let authToken;

  beforeEach(async () => {
    user = await createTestUser();
    authToken = generateToken(user);
    await prisma.cart.deleteMany();
  });

  describe('POST /api/v1/cart/items', () => {
    it('should add item to authenticated user cart', async () => {
      const product = await createTestProduct({ stockQuantity: 10 });

      const response = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: product.id,
          quantity: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].quantity).toBe(2);
    });

    it('should return error for insufficient stock', async () => {
      const product = await createTestProduct({ stockQuantity: 5 });

      const response = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: product.id,
          quantity: 10,
        });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('INSUFFICIENT_STOCK');
      expect(response.body.error.available).toBe(5);
    });
  });
});
```

### 3.2 Component Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProviders } from '@/test/providers';
import { CheckoutPage } from '@/app/checkout/page';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

describe('Checkout Flow Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should complete checkout flow successfully', async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />, { wrapper: TestProviders });

    // Step 1: Fill customer info
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/state/i), 'NY');
    await user.type(screen.getByLabelText(/postal code/i), '10001');

    await user.click(screen.getByRole('button', { name: /continue to shipping/i }));

    // Step 2: Select shipping method
    await waitFor(() => {
      expect(screen.getByText(/shipping method/i)).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText(/standard shipping/i));
    await user.click(screen.getByRole('button', { name: /continue to payment/i }));

    // Step 3: Enter payment
    await waitFor(() => {
      expect(screen.getByText(/payment method/i)).toBeInTheDocument();
    });

    // Mock Stripe Elements interaction
    await user.click(screen.getByRole('button', { name: /review order/i }));

    // Step 4: Review and place order
    await waitFor(() => {
      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /place order/i }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });
  });
});
```

---

## 4. End-to-End Testing Standards

### 4.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4.2 E2E Test Scenarios

#### Complete Purchase Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('guest user can complete checkout', async ({ page }) => {
    // Browse to product
    await page.goto('/');
    await page.click('text=Electronics');
    await page.click('text=Premium Wireless Headphones');

    // Add to cart
    await page.selectOption('[data-testid="color-select"]', 'Black');
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart sidebar
    await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);

    // Proceed to checkout
    await page.click('text=Checkout');

    // Fill shipping information
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="address1"]', '123 Main Street');
    await page.fill('[name="city"]', 'New York');
    await page.selectOption('[name="state"]', 'NY');
    await page.fill('[name="postalCode"]', '10001');
    await page.fill('[name="phone"]', '5551234567');

    await page.click('text=Continue to Shipping');

    // Select shipping method
    await page.click('text=Standard Shipping');
    await page.click('text=Continue to Payment');

    // Enter payment (using Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/28');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    await page.click('text=Review Order');

    // Place order
    await page.click('text=Place Order');

    // Verify confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-testid="order-number"]')).toContainText('SF-');
  });

  test('registered user can use saved address', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="password"]', 'TestPass123!');
    await page.click('text=Sign In');

    // Add item to cart
    await page.goto('/products/premium-wireless-headphones');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('text=Checkout');

    // Should show saved addresses
    await expect(page.locator('[data-testid="saved-address"]')).toBeVisible();
    await page.click('[data-testid="saved-address"]');

    // Continue to payment (skip shipping form)
    await expect(page.locator('text=Shipping Method')).toBeVisible();
  });
});
```

#### User Authentication Flow

```typescript
test.describe('Authentication', () => {
  test('new user can register', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[name="firstName"]', 'Jane');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', `jane.doe.${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.check('[name="acceptTerms"]');

    await page.click('text=Create Account');

    await expect(page.locator('text=Welcome, Jane')).toBeVisible();
  });

  test('user can login and logout', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'TestPass123!');
    await page.click('text=Sign In');

    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Sign Out');

    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'WrongPassword');
    await page.click('text=Sign In');

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
});
```

#### Cart Operations

```typescript
test.describe('Shopping Cart', () => {
  test('user can add, update, and remove items', async ({ page }) => {
    // Add first item
    await page.goto('/products/premium-wireless-headphones');
    await page.click('[data-testid="add-to-cart"]');

    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Add second item
    await page.goto('/products/ergonomic-keyboard');
    await page.fill('[data-testid="quantity-input"]', '2');
    await page.click('[data-testid="add-to-cart"]');

    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('3');

    // Open cart page
    await page.goto('/cart');
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);

    // Update quantity
    await page.locator('[data-testid="cart-item"]').first().locator('[data-testid="increment"]').click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('4');

    // Remove item
    await page.locator('[data-testid="cart-item"]').first().locator('[data-testid="remove"]').click();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  });

  test('cart persists after page reload', async ({ page }) => {
    await page.goto('/products/premium-wireless-headphones');
    await page.click('[data-testid="add-to-cart"]');

    await page.reload();

    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('can apply coupon code', async ({ page }) => {
    await page.goto('/products/premium-wireless-headphones');
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/cart');

    await page.fill('[data-testid="coupon-input"]', 'SAVE10');
    await page.click('[data-testid="apply-coupon"]');

    await expect(page.locator('[data-testid="discount-amount"]')).toContainText('-$');
    await expect(page.locator('[data-testid="coupon-badge"]')).toHaveText('SAVE10');
  });
});
```

---

## 5. Performance Testing

### 5.1 Load Testing with k6

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% errors
    errors: ['rate<0.05'],             // Custom error rate under 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Browse homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, { 'homepage status 200': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(1);

  // Browse products
  res = http.get(`${BASE_URL}/api/v1/products?limit=20`);
  check(res, { 'products status 200': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(1);

  // Search products
  res = http.get(`${BASE_URL}/api/v1/search?q=headphones`);
  check(res, { 'search status 200': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(1);

  // View product detail
  res = http.get(`${BASE_URL}/api/v1/products/premium-wireless-headphones`);
  check(res, { 'product detail status 200': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(2);
}
```

### 5.2 Performance Benchmarks

| Metric | Target | Critical |
|--------|--------|----------|
| Homepage Load | < 2s | < 4s |
| Product List | < 1.5s | < 3s |
| Product Detail | < 1s | < 2s |
| Add to Cart | < 500ms | < 1s |
| Checkout Step | < 1s | < 2s |
| Search Results | < 500ms | < 1s |
| API Response (avg) | < 200ms | < 500ms |
| API Response (p95) | < 500ms | < 1s |

---

## 6. Security Testing

### 6.1 Security Test Checklist

**Authentication:**
- [ ] Password strength requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow
- [ ] Session timeout implemented
- [ ] JWT tokens properly validated

**Authorization:**
- [ ] Role-based access control working
- [ ] Users cannot access other users' data
- [ ] Admin endpoints protected
- [ ] API rate limiting active

**Input Validation:**
- [ ] SQL injection prevented
- [ ] XSS attacks blocked
- [ ] CSRF protection enabled
- [ ] File upload validation

**Data Protection:**
- [ ] PII encrypted at rest
- [ ] Payment data PCI compliant
- [ ] HTTPS enforced
- [ ] Sensitive data not in logs

### 6.2 Security Test Cases

```typescript
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should enforce password complexity', async () => {
      const weakPasswords = ['123456', 'password', 'abc123', 'qwerty'];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password,
            firstName: 'Test',
            lastName: 'User',
          });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should lock account after 5 failed login attempts', async () => {
      const email = 'locktest@example.com';

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password: 'wrong' });
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'correct' });

      expect(response.status).toBe(423);
      expect(response.body.error.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('Authorization', () => {
    it('should prevent accessing other user orders', async () => {
      const user1Token = await getAuthToken('user1@example.com');
      const user2Order = 'ord_user2_123';

      const response = await request(app)
        .get(`/api/v1/orders/${user2Order}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(404);
    });

    it('should prevent non-admin from accessing admin endpoints', async () => {
      const userToken = await getAuthToken('customer@example.com');

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Input Validation', () => {
    it('should prevent SQL injection in search', async () => {
      const maliciousQuery = "'; DROP TABLE products; --";

      const response = await request(app)
        .get('/api/v1/search')
        .query({ q: maliciousQuery });

      expect(response.status).toBe(200);
      // Table should still exist
      const products = await prisma.product.findMany();
      expect(products.length).toBeGreaterThan(0);
    });

    it('should sanitize XSS in review content', async () => {
      const xssContent = '<script>alert("XSS")</script>';

      const response = await request(app)
        .post('/api/v1/products/prod_123/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating: 5,
          content: xssContent,
        });

      expect(response.body.data.content).not.toContain('<script>');
    });
  });
});
```

---

## 7. Accessibility Testing

### 7.1 Automated Accessibility Tests

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('product page should have no accessibility violations', async ({ page }) => {
    await page.goto('/products/premium-wireless-headphones');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('checkout should be keyboard navigable', async ({ page }) => {
    await page.goto('/checkout');

    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[name="firstName"]')).toBeFocused();

    // Continue tabbing through all fields
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/products');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
```

### 7.2 Accessibility Checklist

- [ ] All images have meaningful alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Focus indicators are visible
- [ ] Skip navigation link available
- [ ] Headings follow logical hierarchy
- [ ] Error messages are announced
- [ ] Modals trap focus correctly
- [ ] Keyboard navigation works throughout

---

## 8. Test Data Management

### 8.1 Test Factories

```typescript
// test/factories/product.ts
import { faker } from '@faker-js/faker';
import { prisma } from '@/lib/prisma';

export async function createTestProduct(overrides = {}) {
  return prisma.product.create({
    data: {
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stockQuantity: faker.number.int({ min: 0, max: 100 }),
      isActive: true,
      ...overrides,
    },
  });
}

export async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      passwordHash: await hashPassword('TestPass123!'),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'customer',
      emailVerified: true,
      ...overrides,
    },
  });
}

export async function createTestOrder(userId, overrides = {}) {
  const orderNumber = `SF-${new Date().getFullYear()}-${faker.string.numeric(6)}`;
  return prisma.order.create({
    data: {
      userId,
      orderNumber,
      status: 'confirmed',
      customerEmail: faker.internet.email(),
      subtotal: 99.99,
      shippingAmount: 9.99,
      taxAmount: 8.80,
      totalAmount: 118.78,
      itemCount: 1,
      ...overrides,
    },
  });
}
```

### 8.2 Database Seeding

```typescript
// test/seed.ts
import { prisma } from '@/lib/prisma';
import { createTestProduct, createTestUser } from './factories';

export async function seedTestDatabase() {
  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE order_items, orders, cart_items, carts, products, users CASCADE`;

  // Create test users
  const customer = await createTestUser({
    email: 'customer@test.com',
    role: 'customer',
  });

  const admin = await createTestUser({
    email: 'admin@test.com',
    role: 'admin',
  });

  // Create test products
  const products = await Promise.all([
    createTestProduct({ name: 'Premium Wireless Headphones', price: 199.99 }),
    createTestProduct({ name: 'Ergonomic Keyboard', price: 149.99 }),
    createTestProduct({ name: 'USB-C Hub', price: 79.99 }),
  ]);

  return { customer, admin, products };
}
```

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Workflow

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: shopflow_test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run db:migrate:test
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 10. Bug Reporting Template

```markdown
## Bug Report

**Title:** [Brief description]

**Environment:**
- Browser: Chrome 120
- OS: macOS 14.2
- Device: Desktop
- Build: #123

**Steps to Reproduce:**
1. Navigate to /products
2. Click on "Add to Cart"
3. Open cart sidebar
4. ...

**Expected Behavior:**
Item should be added to cart with correct quantity.

**Actual Behavior:**
Error message appears: "Failed to add item"

**Screenshots/Videos:**
[Attach if available]

**Console Errors:**
```
TypeError: Cannot read property 'id' of undefined
    at CartService.addItem (cart.service.ts:45)
```

**Severity:** High | Medium | Low
**Priority:** P1 | P2 | P3

**Additional Context:**
Only happens when logged out. Works fine when authenticated.
```

---

*Document End - QA Lead Specification*
