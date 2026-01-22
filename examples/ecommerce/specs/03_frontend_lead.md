# ShopFlow - Frontend Lead Specification

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Frontend Engineering

---

## 1. Technology Stack

### 1.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Next.js | 14.x | Framework (App Router) |
| TailwindCSS | 3.x | Styling |
| Zustand | 4.x | State management |
| React Query | 5.x | Server state |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |

### 1.2 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Unit testing |
| Playwright | E2E testing |
| Storybook | Component documentation |
| Husky | Git hooks |

### 1.3 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop)/            # Shop routes group
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product pages
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout flow
│   │   └── account/       # User account
│   ├── (auth)/            # Auth routes group
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── product/           # Product components
│   ├── cart/              # Cart components
│   ├── checkout/          # Checkout components
│   └── account/           # Account components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── services/              # API service layer
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── styles/                # Global styles
```

---

## 2. Design System

### 2.1 Color Palette

```typescript
const colors = {
  // Primary - Brand color
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Neutral - Grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic colors
  success: {
    light: '#dcfce7',
    main: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#b45309',
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#1d4ed8',
  },
};
```

### 2.2 Typography

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],          // 48px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### 2.3 Spacing Scale

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

### 2.4 Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
};
```

### 2.5 Shadows

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};
```

---

## 3. Component Library

### 3.1 Base UI Components

#### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

**Variants:**
| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| primary | primary-500 | white | none | Primary actions |
| secondary | neutral-100 | neutral-900 | none | Secondary actions |
| outline | transparent | primary-500 | primary-500 | Tertiary actions |
| ghost | transparent | neutral-700 | none | Subtle actions |
| danger | error-main | white | none | Destructive actions |

**States:**
- Default, Hover, Active, Focus, Disabled, Loading

#### Input

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

#### Select

```typescript
interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}
```

#### Checkbox

```typescript
interface CheckboxProps {
  label: string;
  description?: string;
  isChecked: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange: (checked: boolean) => void;
}
```

#### Radio Group

```typescript
interface RadioGroupProps {
  label?: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}
```

#### Badge

```typescript
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  size: 'sm' | 'md';
  children: ReactNode;
}
```

#### Card

```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
  children: ReactNode;
}
```

#### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}
```

#### Toast

```typescript
interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  isClosable?: boolean;
}
```

#### Skeleton

```typescript
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}
```

### 3.2 Layout Components

#### Header

```typescript
interface HeaderProps {
  // No props - uses global state for cart count, user
}

// Structure:
// [Logo] [Search Bar] [Navigation] [Cart Icon] [User Menu]
```

**Features:**
- Sticky header on scroll
- Mobile hamburger menu
- Search with autocomplete dropdown
- Cart icon with item count badge
- User dropdown (login/register or account menu)

#### Footer

```typescript
interface FooterProps {
  // No props - static content
}

// Structure:
// [Company Info] [Shop Links] [Support Links] [Newsletter]
// [Copyright] [Social Icons] [Payment Icons]
```

#### Sidebar

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  width?: string;
  children: ReactNode;
}
```

#### Breadcrumbs

```typescript
interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: ReactNode;
}
```

### 3.3 Product Components

#### ProductCard

```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
  };
  variant?: 'default' | 'compact' | 'horizontal';
  showQuickView?: boolean;
  showAddToCart?: boolean;
}
```

**Features:**
- Image with hover zoom effect
- Sale badge if compareAtPrice exists
- Out of stock overlay
- Quick add to cart button on hover
- Star rating display
- Wishlist heart icon

#### ProductGrid

```typescript
interface ProductGridProps {
  products: Product[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  isLoading?: boolean;
  emptyState?: ReactNode;
}
```

#### ProductGallery

```typescript
interface ProductGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  enableZoom?: boolean;
  thumbnailPosition?: 'bottom' | 'left';
}
```

**Features:**
- Main image with zoom on hover
- Thumbnail navigation
- Lightbox on click
- Swipe support on mobile

#### ProductInfo

```typescript
interface ProductInfoProps {
  product: Product;
  onAddToCart: (variantId: string, quantity: number) => void;
  isAddingToCart?: boolean;
}
```

**Sections:**
- Name and brand
- Price (with sale price if applicable)
- Rating and reviews link
- Short description
- Variant selectors (size, color, etc.)
- Quantity selector
- Add to Cart button
- Stock status
- Shipping estimate
- Accordion: Description, Specifications, Reviews

#### ProductFilters

```typescript
interface ProductFiltersProps {
  filters: {
    categories: CategoryFilter[];
    priceRange: { min: number; max: number };
    brands: string[];
    attributes: Record<string, string[]>;
  };
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearAll: () => void;
}
```

**Filter Types:**
- Category tree (collapsible)
- Price range slider
- Brand checkboxes
- Color swatches
- Size buttons
- Rating stars
- In-stock toggle

#### ProductSort

```typescript
interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
}
```

**Default Options:**
- Featured
- Newest
- Price: Low to High
- Price: High to Low
- Best Rating
- Best Selling

### 3.4 Cart Components

#### CartItem

```typescript
interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    variantName: string;
    image: string;
    price: number;
    quantity: number;
    inStock: boolean;
    maxQuantity: number;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}
```

**Features:**
- Product image (linked to product page)
- Name and variant
- Price display
- Quantity selector with +/- buttons
- Remove button
- Out of stock warning
- Subtotal

#### CartSummary

```typescript
interface CartSummaryProps {
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
  };
  shipping?: {
    estimated: boolean;
    amount: number;
  };
  tax?: {
    rate: number;
    amount: number;
  };
  total: number;
  currency?: string;
}
```

#### CartSidebar

```typescript
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Features:**
- Slide-in from right
- Cart items list (scrollable)
- Summary totals
- Checkout button
- Continue shopping link

#### CouponInput

```typescript
interface CouponInputProps {
  appliedCoupon?: {
    code: string;
    discount: number;
  };
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  isLoading?: boolean;
  error?: string;
}
```

### 3.5 Checkout Components

#### CheckoutSteps

```typescript
interface CheckoutStepsProps {
  currentStep: 'information' | 'shipping' | 'payment' | 'review';
  completedSteps: string[];
}
```

**Visual:**
```
[1. Information] --- [2. Shipping] --- [3. Payment] --- [4. Review]
     (done)            (current)         (pending)       (pending)
```

#### AddressForm

```typescript
interface AddressFormProps {
  address?: Address;
  onSubmit: (address: Address) => void;
  isLoading?: boolean;
  showSaveCheckbox?: boolean;
}
```

**Fields:**
- First Name, Last Name (side by side)
- Company (optional)
- Address Line 1
- Address Line 2 (optional)
- City
- State/Province (dropdown)
- Postal Code
- Country (dropdown)
- Phone

#### ShippingMethodSelector

```typescript
interface ShippingMethodSelectorProps {
  methods: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
  }>;
  selectedId: string;
  onChange: (id: string) => void;
}
```

#### PaymentForm

```typescript
interface PaymentFormProps {
  onSubmit: (paymentMethod: PaymentMethod) => void;
  savedCards?: SavedCard[];
  isLoading?: boolean;
}
```

**Payment Methods:**
- Credit/Debit Card (Stripe Elements)
- PayPal button
- Apple Pay / Google Pay (when available)

#### OrderSummaryPanel

```typescript
interface OrderSummaryPanelProps {
  items: CartItem[];
  totals: CartTotals;
  shippingMethod?: ShippingMethod;
  coupon?: AppliedCoupon;
  isCollapsible?: boolean;
}
```

### 3.6 Account Components

#### AccountNav

```typescript
interface AccountNavProps {
  activeItem: string;
}

// Menu Items:
// - Dashboard
// - Orders
// - Addresses
// - Payment Methods
// - Profile
// - Wishlist
// - Logout
```

#### OrderList

```typescript
interface OrderListProps {
  orders: Order[];
  isLoading?: boolean;
  onViewOrder: (orderId: string) => void;
}
```

#### OrderDetails

```typescript
interface OrderDetailsProps {
  order: Order;
  onTrackShipment: () => void;
  onRequestReturn: () => void;
  onReorder: () => void;
}
```

**Sections:**
- Order header (number, date, status badge)
- Order timeline
- Items list
- Shipping address and method
- Payment method
- Totals breakdown
- Action buttons

#### AddressList

```typescript
interface AddressListProps {
  addresses: Address[];
  defaultAddressId?: string;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  onAddNew: () => void;
}
```

---

## 4. Page Specifications

### 4.1 Homepage

**Route:** `/`

**Sections:**
1. Hero Banner (carousel)
2. Featured Categories
3. New Arrivals (product grid)
4. Best Sellers (product grid)
5. Promotional Banner
6. Newsletter Signup

**Data Requirements:**
- Featured categories (4-6)
- New arrival products (8)
- Best selling products (8)
- Hero banner content (CMS)

### 4.2 Product Listing Page (PLP)

**Route:** `/products`, `/products/[category]`

**Layout:**
```
[Breadcrumbs]
[Category Header]
-----------------------------------------
|  Filters   |  [Sort] [View] [Count]   |
|  Sidebar   |  [Product Grid]          |
|            |  [Load More / Pagination]|
-----------------------------------------
```

**Features:**
- URL-based filter state
- Infinite scroll or pagination
- Grid/List view toggle
- Mobile filter drawer
- Active filter chips
- Empty state handling

**Data Requirements:**
- Products with pagination
- Category info
- Available filters

### 4.3 Product Detail Page (PDP)

**Route:** `/products/[slug]`

**Layout:**
```
[Breadcrumbs]
-----------------------------------------
|  Product Gallery  |  Product Info     |
|  (images)         |  (name, price,    |
|                   |   variants, ATC)  |
-----------------------------------------
[Product Tabs: Description | Specs | Reviews]
-----------------------------------------
[Related Products]
[Recently Viewed]
```

**Features:**
- Image zoom and lightbox
- Variant selection updates URL
- Add to cart with quantity
- Wishlist toggle
- Social sharing
- Review submission (logged in)

**Data Requirements:**
- Full product data
- Related products
- Reviews with pagination

### 4.4 Cart Page

**Route:** `/cart`

**Layout:**
```
[Cart Header]
-----------------------------------------
|  Cart Items        |  Order Summary   |
|  (list)            |  Coupon Input    |
|                    |  Totals          |
|                    |  Checkout Button |
-----------------------------------------
[Recently Viewed / Recommended]
```

**Features:**
- Real-time quantity updates
- Stock validation
- Coupon application
- Shipping estimate by zip
- Empty cart state

### 4.5 Checkout Pages

**Route:** `/checkout`, `/checkout/shipping`, `/checkout/payment`, `/checkout/review`

**Multi-step Flow:**

**Step 1: Information**
```
[Contact Info]
- Email (or login prompt)
[Shipping Address]
- Address form
[Continue to Shipping]
```

**Step 2: Shipping**
```
[Shipping Address Summary]
[Shipping Method Selection]
[Continue to Payment]
```

**Step 3: Payment**
```
[Payment Method Selection]
- Card form / PayPal / Apple Pay
[Billing Address]
- Same as shipping checkbox
[Continue to Review]
```

**Step 4: Review**
```
[Order Summary]
- All items
- Shipping details
- Payment method
- Totals
[Place Order Button]
```

### 4.6 Order Confirmation

**Route:** `/checkout/confirmation/[orderId]`

**Layout:**
```
[Success Icon + Message]
[Order Number]
[Order Details Summary]
[Next Steps]
- Track order link
- Continue shopping
- Create account (guest)
```

### 4.7 Account Dashboard

**Route:** `/account`

**Layout:**
```
[Account Navigation]
-----------------------------------------
|  Nav Sidebar  |  Main Content Area   |
|               |                      |
-----------------------------------------
```

**Dashboard Content:**
- Welcome message
- Recent orders (3)
- Default addresses (2)
- Quick links

### 4.8 Order History

**Route:** `/account/orders`

**Features:**
- Paginated order list
- Status filters
- Search by order number
- Order details modal/page

### 4.9 Authentication Pages

**Login (`/login`):**
- Email and password fields
- Remember me checkbox
- Forgot password link
- Social login buttons
- Register link

**Register (`/register`):**
- Name fields
- Email field
- Password with requirements
- Terms acceptance
- Marketing opt-in
- Social signup buttons
- Login link

**Forgot Password (`/forgot-password`):**
- Email field
- Submit button
- Back to login link

**Reset Password (`/reset-password`):**
- New password field
- Confirm password field
- Submit button

---

## 5. State Management

### 5.1 Zustand Stores

#### Cart Store

```typescript
interface CartStore {
  // State
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;

  // Computed
  itemCount: number;
  isEmpty: boolean;
}
```

#### Auth Store

```typescript
interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}
```

#### UI Store

```typescript
interface UIStore {
  // State
  isCartSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: ToastMessage | null;

  // Actions
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
  toggleMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  showToast: (toast: ToastMessage) => void;
  hideToast: () => void;
}
```

### 5.2 React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Query Keys:**
```typescript
const queryKeys = {
  products: {
    all: ['products'],
    list: (filters: ProductFilters) => ['products', 'list', filters],
    detail: (id: string) => ['products', 'detail', id],
    reviews: (id: string) => ['products', 'reviews', id],
  },
  categories: {
    all: ['categories'],
    detail: (slug: string) => ['categories', slug],
  },
  cart: ['cart'],
  orders: {
    all: ['orders'],
    detail: (id: string) => ['orders', id],
  },
  user: {
    profile: ['user', 'profile'],
    addresses: ['user', 'addresses'],
  },
};
```

---

## 6. API Integration

### 6.1 API Client Setup

```typescript
// lib/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 6.2 Service Layer Pattern

```typescript
// services/products.ts
export const productsService = {
  getProducts: async (params: ProductParams): Promise<ProductsResponse> => {
    const { data } = await apiClient.get('/products', { params });
    return data.data;
  },

  getProduct: async (idOrSlug: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${idOrSlug}`);
    return data.data;
  },

  getProductReviews: async (productId: string, params: ReviewParams): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get(`/products/${productId}/reviews`, { params });
    return data.data;
  },
};
```

---

## 7. Performance Requirements

### 7.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTFB | < 600ms | Time to First Byte |
| FCP | < 1.8s | First Contentful Paint |

### 7.2 Optimization Strategies

**Image Optimization:**
- Next.js Image component for all images
- WebP format with fallbacks
- Responsive srcset
- Lazy loading below fold

**Code Splitting:**
- Route-based code splitting (automatic)
- Dynamic imports for heavy components
- Vendor chunk optimization

**Caching:**
- Static page generation where possible
- ISR for product pages
- Client-side caching with React Query

**Bundle Size:**
- Target: < 200KB initial JS
- Tree shaking enabled
- No unused dependencies

---

## 8. Accessibility Requirements

### 8.1 WCAG 2.1 AA Compliance

**Focus Management:**
- Visible focus indicators (2px outline)
- Logical tab order
- Focus trap in modals
- Skip to main content link

**Screen Reader Support:**
- Semantic HTML elements
- ARIA labels on interactive elements
- Live regions for dynamic content
- Alt text for all images

**Keyboard Navigation:**
- All functionality keyboard accessible
- Escape to close modals/dropdowns
- Arrow keys for menu navigation
- Enter/Space for activation

**Forms:**
- Associated labels for all inputs
- Error messages linked to fields
- Clear error descriptions
- Required field indicators

### 8.2 Testing Checklist

- [ ] Keyboard-only navigation works
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Focus is visible and logical
- [ ] Forms are properly labeled
- [ ] Images have alt text
- [ ] Dynamic content is announced
- [ ] No motion without preference check

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Coverage Target:** 80%

**What to Test:**
- Utility functions
- Custom hooks
- Store actions
- Form validation
- Component logic

**Tools:** Jest, React Testing Library

### 9.2 Integration Testing

**What to Test:**
- Form submissions
- API integration
- State management flows
- Component interactions

### 9.3 E2E Testing

**Critical Paths:**
- Complete checkout flow
- User registration and login
- Product search and filtering
- Cart operations

**Tools:** Playwright

### 9.4 Visual Regression

**What to Test:**
- Component appearance
- Responsive layouts
- Theme consistency

**Tools:** Chromatic + Storybook

---

## 10. Development Workflow

### 10.1 Branch Strategy

```
main (production)
  └── develop (staging)
        ├── feature/SF-123-product-filters
        ├── feature/SF-124-checkout-flow
        └── bugfix/SF-125-cart-total
```

### 10.2 Commit Convention

```
type(scope): description

feat(cart): add coupon code input component
fix(checkout): correct tax calculation
docs(readme): update setup instructions
style(button): adjust hover state colors
refactor(api): extract common fetch logic
test(cart): add unit tests for cart store
```

### 10.3 PR Checklist

- [ ] Code follows style guide
- [ ] Unit tests added/updated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Storybook stories updated
- [ ] Accessibility verified
- [ ] Responsive design tested
- [ ] Screenshots attached

---

*Document End - Frontend Lead Specification*
