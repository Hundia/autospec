import { apiClient } from './client.ts';
import type { MealPlan, MealPlanWithEntries, CreateMealPlanDto } from '../types/mealPlan.types.ts';

export async function fetchMealPlans(): Promise<{ data: MealPlan[] }> {
  const response = await apiClient.get<{ data: MealPlan[] }>('/meal-plans');
  return response.data;
}

export async function fetchMealPlanById(id: string): Promise<MealPlanWithEntries> {
  const response = await apiClient.get<MealPlanWithEntries>(`/meal-plans/${id}`);
  return response.data;
}

export async function createMealPlan(data: CreateMealPlanDto): Promise<MealPlan> {
  const response = await apiClient.post<MealPlan>('/meal-plans', data);
  return response.data;
}

export async function updateMealPlan(
  id: string,
  data: Partial<CreateMealPlanDto>
): Promise<MealPlan> {
  const response = await apiClient.put<MealPlan>(`/meal-plans/${id}`, data);
  return response.data;
}

export async function deleteMealPlan(id: string): Promise<void> {
  await apiClient.delete(`/meal-plans/${id}`);
}

export async function activateMealPlan(id: string): Promise<MealPlan> {
  const response = await apiClient.post<MealPlan>(`/meal-plans/${id}/activate`);
  return response.data;
}
