import type { Recipe } from './recipe.types.ts';

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanEntry {
  id: string;
  mealPlanId: string;
  recipeId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingsOverride: number | null;
  recipe?: Recipe;
}

export interface MealPlanWithEntries extends MealPlan {
  entries: MealPlanEntry[];
}

export interface CreateMealPlanDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface CreateEntryDto {
  recipeId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingsOverride?: number;
}
