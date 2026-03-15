import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute.tsx';
import { AppLayout } from './components/layout/AppLayout.tsx';
import { AuthLayout } from './components/layout/AuthLayout.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import { useAuthStore } from './stores/authStore.ts';

// Lazy-loaded pages for code splitting
const RecipeListPage = lazy(() => import('./pages/recipes/RecipeListPage.tsx'));
const RecipeDetailPage = lazy(() => import('./pages/recipes/RecipeDetailPage.tsx'));
const CreateRecipePage = lazy(() => import('./pages/recipes/CreateRecipePage.tsx'));
const EditRecipePage = lazy(() => import('./pages/recipes/EditRecipePage.tsx'));
const MealPlanListPage = lazy(() => import('./pages/meal-plans/MealPlanListPage.tsx'));
const MealPlanCalendarPage = lazy(() => import('./pages/meal-plans/MealPlanCalendarPage.tsx'));
const ShoppingListPage = lazy(() => import('./pages/shopping/ShoppingListPage.tsx'));

function RootRedirect() {
  const user = useAuthStore((s) => s.user);
  return <Navigate to={user ? '/recipes' : '/login'} replace />;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/recipes"
            element={
              <Suspense fallback={<PageLoader />}>
                <RecipeListPage />
              </Suspense>
            }
          />
          <Route
            path="/recipes/new"
            element={
              <Suspense fallback={<PageLoader />}>
                <CreateRecipePage />
              </Suspense>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <RecipeDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/recipes/:id/edit"
            element={
              <Suspense fallback={<PageLoader />}>
                <EditRecipePage />
              </Suspense>
            }
          />
          <Route
            path="/meal-plans"
            element={
              <Suspense fallback={<PageLoader />}>
                <MealPlanListPage />
              </Suspense>
            }
          />
          <Route
            path="/meal-plans/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <MealPlanCalendarPage />
              </Suspense>
            }
          />
          <Route
            path="/shopping-list"
            element={
              <Suspense fallback={<PageLoader />}>
                <ShoppingListPage />
              </Suspense>
            }
          />
        </Route>

        {/* 404 catch-all */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-500">Page not found</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}
