import type { IngredientCategory } from './ingredient.types.ts';

export interface RecipeIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl: string | null;
  caloriesPerServing: number | null;
  proteinGrams: string | null;
  carbsGrams: string | null;
  fatGrams: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

export interface RecipeListResponse {
  data: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
  caloriesPerServing?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export type UpdateRecipeDto = Partial<CreateRecipeDto>;

export interface RecipeQuery {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxTime?: number;
}
