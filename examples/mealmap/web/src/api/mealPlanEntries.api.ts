import { apiClient } from './client.ts';
import type { MealPlanEntry, CreateEntryDto } from '../types/mealPlan.types.ts';

export async function addEntry(planId: string, data: CreateEntryDto): Promise<MealPlanEntry> {
  const response = await apiClient.post<MealPlanEntry>(
    `/meal-plans/${planId}/entries`,
    data
  );
  return response.data;
}

export async function removeEntry(planId: string, entryId: string): Promise<void> {
  await apiClient.delete(`/meal-plans/${planId}/entries/${entryId}`);
}
