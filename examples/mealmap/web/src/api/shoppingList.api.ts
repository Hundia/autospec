import { apiClient } from './client.ts';
import type { ShoppingListResponse } from '../types/shoppingList.types.ts';

export async function getShoppingList(planId: string): Promise<ShoppingListResponse> {
  const response = await apiClient.get<ShoppingListResponse>(
    `/meal-plans/${planId}/shopping-list`
  );
  return response.data;
}
