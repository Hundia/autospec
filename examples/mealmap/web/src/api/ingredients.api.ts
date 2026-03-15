import { apiClient } from './client.ts';
import type { Ingredient } from '../types/ingredient.types.ts';

export async function fetchIngredients(search?: string): Promise<{ data: Ingredient[] }> {
  const response = await apiClient.get<{ data: Ingredient[] }>('/ingredients', {
    params: search ? { search } : undefined,
  });
  return response.data;
}

export async function createIngredient(
  name: string,
  category: string
): Promise<Ingredient> {
  const response = await apiClient.post<Ingredient>('/ingredients', { name, category });
  return response.data;
}
