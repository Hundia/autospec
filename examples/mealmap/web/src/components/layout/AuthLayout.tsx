import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.ts';

export function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  // Redirect to app if already logged in
  if (user) {
    return <Navigate to="/recipes" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🥗 MealMap</h1>
          <p className="text-gray-500 mt-2">Plan your meals, simplify your life</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
