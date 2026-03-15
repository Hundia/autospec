import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Token accessor — set by authStore after initialization to avoid circular import
let getAccessToken: (() => string | null) | null = null;
let refreshTokenFn: (() => Promise<void>) | null = null;
let logoutFn: (() => void) | null = null;

export function setApiAuthHandlers(handlers: {
  getAccessToken: () => string | null;
  refreshToken: () => Promise<void>;
  logout: () => void;
}) {
  getAccessToken = handlers.getAccessToken;
  refreshTokenFn = handlers.refreshToken;
  logoutFn = handlers.logout;
}

export const apiClient = axios.create({
  baseURL: (import.meta.env['VITE_API_URL'] as string | undefined) ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor: attach access token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 → refresh → retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry && refreshTokenFn) {
      originalRequest._retry = true;
      try {
        await refreshTokenFn();
        return apiClient(originalRequest);
      } catch {
        logoutFn?.();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
