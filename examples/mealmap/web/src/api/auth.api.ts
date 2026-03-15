import { apiClient } from './client.ts';
import type { AuthResponse, RefreshResponse } from '../types/auth.types.ts';

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
