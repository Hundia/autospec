import type { IngredientCategory } from './ingredient.types.ts';

export interface ShoppingListItem {
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  lines: { quantity: string; unit: string }[];
}

export interface ShoppingListResponse {
  mealPlanId: string;
  mealPlanName: string;
  items: ShoppingListItem[];
  groupedByCategory: Record<IngredientCategory, string[]>;
}
