import axios from 'axios';
import { apiClient } from './client.ts';
import type {
  RecipeListResponse,
  RecipeWithIngredients,
  CreateRecipeDto,
  UpdateRecipeDto,
  RecipeQuery,
} from '../types/recipe.types.ts';

export async function fetchRecipes(query: RecipeQuery = {}): Promise<RecipeListResponse> {
  try {
    const response = await apiClient.get<RecipeListResponse>('/recipes', { params: query });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch recipes');
    }
    throw error;
  }
}

export async function fetchRecipeById(id: string): Promise<RecipeWithIngredients> {
  try {
    const response = await apiClient.get<RecipeWithIngredients>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch recipe');
    }
    throw error;
  }
}

export async function createRecipe(data: CreateRecipeDto): Promise<RecipeWithIngredients> {
  try {
    const response = await apiClient.post<RecipeWithIngredients>('/recipes', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to create recipe');
    }
    throw error;
  }
}

export async function updateRecipe(
  id: string,
  data: UpdateRecipeDto
): Promise<RecipeWithIngredients> {
  try {
    const response = await apiClient.put<RecipeWithIngredients>(`/recipes/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to update recipe');
    }
    throw error;
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  try {
    await apiClient.delete(`/recipes/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to delete recipe');
    }
    throw error;
  }
}
