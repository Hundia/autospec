import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      // Clear auth state on 401
      // In Sprint 1, this will redirect to /login via auth store
      console.warn('Unauthorized — redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
