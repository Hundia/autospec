# ShopFlow Frontend Architecture

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Frontend Engineering

---

## 1. Component Architecture

### 1.1 Component Tree

```
App (layout.tsx)
├── Providers
│   ├── QueryClientProvider (React Query)
│   ├── AuthProvider
│   └── ToastProvider
│
├── Header
│   ├── Logo
│   ├── Navigation
│   │   ├── NavLink
│   │   └── MegaMenu
│   ├── SearchBar
│   │   ├── SearchInput
│   │   └── AutocompleteDropdown
│   ├── CartIcon (with badge)
│   └── UserMenu
│       ├── LoginButton
│       └── AccountDropdown
│
├── Main Content (varies by route)
│   │
│   ├── HomePage
│   │   ├── HeroBanner
│   │   ├── CategoryGrid
│   │   ├── ProductSection (New Arrivals)
│   │   ├── PromoBanner
│   │   ├── ProductSection (Best Sellers)
│   │   └── NewsletterSignup
│   │
│   ├── ProductListingPage
│   │   ├── Breadcrumbs
│   │   ├── CategoryHeader
│   │   ├── FilterSidebar
│   │   │   ├── CategoryFilter
│   │   │   ├── PriceRangeSlider
│   │   │   ├── BrandCheckboxes
│   │   │   └── ColorSwatches
│   │   ├── SortDropdown
│   │   ├── ActiveFilters
│   │   ├── ProductGrid
│   │   │   └── ProductCard[]
│   │   └── Pagination
│   │
│   ├── ProductDetailPage
│   │   ├── Breadcrumbs
│   │   ├── ProductGallery
│   │   │   ├── MainImage
│   │   │   └── Thumbnails
│   │   ├── ProductInfo
│   │   │   ├── ProductTitle
│   │   │   ├── PriceDisplay
│   │   │   ├── StarRating
│   │   │   ├── VariantSelector
│   │   │   ├── QuantitySelector
│   │   │   ├── AddToCartButton
│   │   │   └── WishlistButton
│   │   ├── ProductTabs
│   │   │   ├── DescriptionTab
│   │   │   ├── SpecificationsTab
│   │   │   └── ReviewsTab
│   │   └── RelatedProducts
│   │
│   ├── CartPage
│   │   ├── CartItems
│   │   │   └── CartItem[]
│   │   ├── CouponInput
│   │   └── CartSummary
│   │
│   ├── CheckoutPages
│   │   ├── CheckoutSteps
│   │   ├── InformationStep
│   │   │   ├── ContactForm
│   │   │   └── AddressForm
│   │   ├── ShippingStep
│   │   │   └── ShippingMethodSelector
│   │   ├── PaymentStep
│   │   │   ├── PaymentForm (Stripe)
│   │   │   └── BillingAddressToggle
│   │   ├── ReviewStep
│   │   │   └── OrderSummaryPanel
│   │   └── ConfirmationPage
│   │
│   └── AccountPages
│       ├── AccountNav
│       ├── DashboardPage
│       ├── OrdersPage
│       │   └── OrderList
│       ├── OrderDetailPage
│       │   └── OrderDetails
│       └── AddressesPage
│           └── AddressList
│
├── CartSidebar (overlay)
│   ├── CartHeader
│   ├── CartItemList
│   └── CartFooter
│
├── Footer
│   ├── FooterNav
│   ├── SocialLinks
│   └── PaymentIcons
│
└── Modals/Overlays
    ├── LoginModal
    ├── QuickViewModal
    └── ToastContainer
```

---

## 2. State Management

### 2.1 State Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Global State                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Zustand Stores (Client State)                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ authStore   │ │ cartStore   │ │  uiStore    │           │
│  │             │ │             │ │             │           │
│  │ - user      │ │ - items     │ │ - sidebar   │           │
│  │ - isAuth    │ │ - total     │ │ - modal     │           │
│  │ - loading   │ │ - coupon    │ │ - toast     │           │
│  │             │ │             │ │             │           │
│  │ Actions:    │ │ Actions:    │ │ Actions:    │           │
│  │ - login     │ │ - add       │ │ - open      │           │
│  │ - logout    │ │ - remove    │ │ - close     │           │
│  │ - refresh   │ │ - update    │ │ - toggle    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  React Query (Server State)                                 │
│  ┌─────────────────────────────────────────────┐           │
│  │ Cached Queries:                              │           │
│  │ - products (list, detail, search)           │           │
│  │ - categories                                 │           │
│  │ - orders (list, detail)                      │           │
│  │ - user profile                               │           │
│  │ - addresses                                  │           │
│  │                                              │           │
│  │ Mutations:                                   │           │
│  │ - addToCart, updateCart, removeFromCart     │           │
│  │ - createOrder, cancelOrder                   │           │
│  │ - updateProfile, addAddress                  │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Local State                           │
├─────────────────────────────────────────────────────────────┤
│  useState / useReducer (Component-specific)                 │
│  - Form inputs                                              │
│  - Accordion open/close                                     │
│  - Image gallery index                                      │
│  - Filter selections (before apply)                         │
│  - Quantity selector value                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Zustand Store Implementation

```typescript
// stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'merchant' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshTokens: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        if (accessToken) {
          await authService.logout();
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        });
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await authService.refresh(refreshToken);
          set({ accessToken: response.accessToken });
        } catch {
          // Refresh failed, logout user
          get().logout();
        }
      },

      setUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

### 2.3 Cart Store

```typescript
// stores/cartStore.ts

interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  image: string;
  price: number;
  quantity: number;
  inStock: boolean;
  maxQuantity: number;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Computed
  itemCount: number;
  subtotal: number;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  get itemCount() {
    return get().cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  },

  get subtotal() {
    return get().cart?.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    ) ?? 0;
  },

  addItem: async (productId, variantId, quantity) => {
    set({ isLoading: true, error: null });

    // Optimistic update
    const prevCart = get().cart;

    try {
      const updatedCart = await cartService.addItem(productId, variantId, quantity);
      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      // Rollback on error
      set({ cart: prevCart, isLoading: false, error: error.message });
      throw error;
    }
  },

  // ... other actions
}));
```

---

## 3. React Query Configuration

### 3.1 Query Client Setup

```typescript
// lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 3.2 Query Keys

```typescript
// lib/queryKeys.ts

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    reviews: (id: string) =>
      [...queryKeys.products.detail(id), 'reviews'] as const,
  },

  categories: {
    all: ['categories'] as const,
    tree: () => [...queryKeys.categories.all, 'tree'] as const,
    detail: (slug: string) => [...queryKeys.categories.all, slug] as const,
  },

  cart: ['cart'] as const,

  orders: {
    all: ['orders'] as const,
    list: (filters?: OrderFilters) => [...queryKeys.orders.all, filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },

  user: {
    profile: ['user', 'profile'] as const,
    addresses: ['user', 'addresses'] as const,
  },

  search: {
    all: ['search'] as const,
    results: (query: string, filters?: SearchFilters) =>
      [...queryKeys.search.all, query, filters] as const,
    autocomplete: (query: string) =>
      [...queryKeys.search.all, 'autocomplete', query] as const,
  },
};
```

### 3.3 Query Hooks

```typescript
// hooks/useProducts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getProducts(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(idOrSlug),
    queryFn: () => productsService.getProduct(idOrSlug),
    enabled: !!idOrSlug,
  });
}

export function useProductReviews(productId: string, page: number = 1) {
  return useQuery({
    queryKey: [...queryKeys.products.reviews(productId), page],
    queryFn: () => productsService.getReviews(productId, page),
    enabled: !!productId,
  });
}

export function useAddReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewInput) =>
      productsService.addReview(productId, data),
    onSuccess: () => {
      // Invalidate reviews to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.reviews(productId)
      });
      // Also invalidate product detail for updated rating
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId)
      });
    },
  });
}
```

---

## 4. Routing Architecture

### 4.1 Route Structure (Next.js App Router)

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Homepage (/)
├── loading.tsx             # Loading UI
├── error.tsx               # Error boundary
├── not-found.tsx           # 404 page
│
├── (shop)/                 # Shop route group (no layout change)
│   ├── products/
│   │   ├── page.tsx        # Product listing (/products)
│   │   └── [slug]/
│   │       └── page.tsx    # Product detail (/products/[slug])
│   │
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx    # Category listing (/categories/[slug])
│   │
│   ├── search/
│   │   └── page.tsx        # Search results (/search)
│   │
│   └── cart/
│       └── page.tsx        # Cart page (/cart)
│
├── (auth)/                 # Auth route group
│   ├── layout.tsx          # Auth-specific layout (centered)
│   ├── login/
│   │   └── page.tsx        # Login page (/login)
│   ├── register/
│   │   └── page.tsx        # Register page (/register)
│   ├── forgot-password/
│   │   └── page.tsx        # Forgot password (/forgot-password)
│   └── reset-password/
│       └── page.tsx        # Reset password (/reset-password)
│
├── (account)/              # Protected account routes
│   ├── layout.tsx          # Account layout with sidebar
│   └── account/
│       ├── page.tsx        # Dashboard (/account)
│       ├── orders/
│       │   ├── page.tsx    # Order history (/account/orders)
│       │   └── [id]/
│       │       └── page.tsx # Order detail (/account/orders/[id])
│       ├── addresses/
│       │   └── page.tsx    # Addresses (/account/addresses)
│       └── profile/
│           └── page.tsx    # Profile (/account/profile)
│
├── checkout/               # Checkout flow
│   ├── layout.tsx          # Checkout layout (minimal header)
│   ├── page.tsx            # Information step (/checkout)
│   ├── shipping/
│   │   └── page.tsx        # Shipping step (/checkout/shipping)
│   ├── payment/
│   │   └── page.tsx        # Payment step (/checkout/payment)
│   ├── review/
│   │   └── page.tsx        # Review step (/checkout/review)
│   └── confirmation/
│       └── [orderId]/
│           └── page.tsx    # Confirmation (/checkout/confirmation/[orderId])
│
└── admin/                  # Admin routes (protected)
    ├── layout.tsx          # Admin layout with sidebar
    ├── page.tsx            # Admin dashboard (/admin)
    ├── products/
    │   ├── page.tsx        # Product list (/admin/products)
    │   ├── new/
    │   │   └── page.tsx    # New product (/admin/products/new)
    │   └── [id]/
    │       └── page.tsx    # Edit product (/admin/products/[id])
    └── orders/
        └── page.tsx        # Order management (/admin/orders)
```

### 4.2 Route Protection

```typescript
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/account', '/checkout'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route)) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect account routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ],
};
```

---

## 5. Data Fetching Patterns

### 5.1 Server Components (Recommended)

```typescript
// app/products/[slug]/page.tsx

import { productsService } from '@/services/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedProducts } from '@/components/product/RelatedProducts';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await productsService.getProduct(params.slug);

  return {
    title: `${product.name} | ShopFlow`,
    description: product.shortDescription,
    openGraph: {
      images: [product.images[0]?.url],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await productsService.getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={product.category.breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <Suspense fallback={<ProductGridSkeleton />}>
        <RelatedProducts productId={product.id} />
      </Suspense>
    </div>
  );
}
```

### 5.2 Client Components with React Query

```typescript
// components/product/RelatedProducts.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { productsService } from '@/services/products';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface Props {
  productId: string;
}

export function RelatedProducts({ productId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.products.detail(productId), 'related'],
    queryFn: () => productsService.getRelatedProducts(productId),
  });

  if (isLoading) {
    return <ProductGridSkeleton count={4} />;
  }

  if (!data?.products.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

---

## 6. API Client

### 6.1 Axios Setup

```typescript
// lib/apiClient.ts

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshTokens();
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
```

### 6.2 Service Layer

```typescript
// services/products.ts

import { apiClient } from '@/lib/apiClient';
import type { Product, ProductFilters, ProductsResponse } from '@/types';

export const productsService = {
  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.sort) params.set('sort', filters.sort);
    params.set('page', String(filters.page || 1));
    params.set('limit', String(filters.limit || 20));

    const { data } = await apiClient.get(`/products?${params}`);
    return data.data;
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const { data } = await apiClient.get(`/products/${idOrSlug}`);
    return data.data;
  },

  async getRelatedProducts(productId: string): Promise<{ products: Product[] }> {
    const { data } = await apiClient.get(`/products/${productId}/related`);
    return data.data;
  },

  async getReviews(productId: string, page: number = 1) {
    const { data } = await apiClient.get(
      `/products/${productId}/reviews?page=${page}`
    );
    return data.data;
  },

  async addReview(productId: string, review: ReviewInput) {
    const { data } = await apiClient.post(
      `/products/${productId}/reviews`,
      review
    );
    return data.data;
  },
};
```

---

## 7. Performance Optimization

### 7.1 Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const ProductGallery = dynamic(
  () => import('@/components/product/ProductGallery'),
  { loading: () => <ProductGallerySkeleton /> }
);

const ReviewList = dynamic(
  () => import('@/components/product/ReviewList'),
  { loading: () => <ReviewListSkeleton /> }
);

// Route-based code splitting is automatic with App Router
```

### 7.2 Image Optimization

```typescript
// components/ui/OptimizedImage.tsx

import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}
```

### 7.3 Bundle Size Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial JS | < 150 KB | Bundle analyzer |
| Total JS (parsed) | < 400 KB | Bundle analyzer |
| CSS | < 50 KB | Bundle analyzer |
| LCP | < 2.5s | Web Vitals |
| FID | < 100ms | Web Vitals |
| CLS | < 0.1 | Web Vitals |

---

## 8. Testing Strategy

### 8.1 Component Testing

```typescript
// __tests__/components/ProductCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import { createTestProduct } from '@/tests/fixtures';

describe('ProductCard', () => {
  const product = createTestProduct({
    name: 'Test Product',
    price: 99.99,
    compareAtPrice: 129.99,
    inStock: true,
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
  });

  it('shows sale badge when compareAtPrice exists', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('shows out of stock overlay when not in stock', () => {
    const outOfStockProduct = { ...product, inStock: false };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('calls onQuickAdd when quick add button is clicked', () => {
    const onQuickAdd = jest.fn();
    render(<ProductCard product={product} onQuickAdd={onQuickAdd} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onQuickAdd).toHaveBeenCalledWith(product.id);
  });
});
```

### 8.2 Integration Testing

```typescript
// __tests__/flows/checkout.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutFlow } from '@/app/checkout/page';
import { TestProviders } from '@/tests/TestProviders';

describe('Checkout Flow', () => {
  it('completes checkout successfully', async () => {
    const user = userEvent.setup();

    render(
      <TestProviders>
        <CheckoutFlow />
      </TestProviders>
    );

    // Fill shipping info
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/state/i), 'NY');
    await user.type(screen.getByLabelText(/zip/i), '10001');

    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Select shipping method
    await waitFor(() => {
      expect(screen.getByText(/shipping method/i)).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText(/standard shipping/i));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Payment step
    await waitFor(() => {
      expect(screen.getByText(/payment/i)).toBeInTheDocument();
    });

    // ... continue with payment and completion
  });
});
```

---

## 9. Error Handling

### 9.1 Error Boundary

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-center">
        We apologize for the inconvenience. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### 9.2 Form Error Handling

```typescript
// hooks/useFormError.ts

import { useState } from 'react';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';

interface FormErrors {
  [field: string]: string;
}

export function useFormError() {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleError = (error: unknown) => {
    if (error instanceof ZodError) {
      const fieldErrors: FormErrors = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (error instanceof AxiosError) {
      const apiErrors = error.response?.data?.error?.details;
      if (apiErrors) {
        const fieldErrors: FormErrors = {};
        apiErrors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // Generic error
    setErrors({ _form: 'An unexpected error occurred' });
  };

  const clearErrors = () => setErrors({});
  const getError = (field: string) => errors[field];

  return { errors, handleError, clearErrors, getError };
}
```

---

## 10. Accessibility

### 10.1 Focus Management

```typescript
// hooks/useFocusTrap.ts

import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}
```

---

*Document End - Frontend Architecture*
