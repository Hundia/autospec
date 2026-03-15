import { create } from 'zustand';
import * as recipesApi from '../api/recipes.api.ts';
import type {
  Recipe,
  RecipeWithIngredients,
  CreateRecipeDto,
  UpdateRecipeDto,
  RecipeQuery,
} from '../types/recipe.types.ts';

interface RecipeFilters {
  search: string;
  tag: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  maxTime: number | null;
}

interface RecipeState {
  recipes: Recipe[];
  activeRecipe: RecipeWithIngredients | null;
  filters: RecipeFilters;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  isLoading: boolean;
  error: string | null;

  fetchRecipes: () => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  setFilter: (key: keyof RecipeFilters, value: RecipeFilters[keyof RecipeFilters]) => void;
  clearFilters: () => void;
  createRecipe: (data: CreateRecipeDto) => Promise<Recipe>;
  updateRecipe: (id: string, data: UpdateRecipeDto) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  clearActiveRecipe: () => void;
}

const defaultFilters: RecipeFilters = {
  search: '',
  tag: null,
  difficulty: null,
  maxTime: null,
};

export const useRecipeStore = create<RecipeState>()((set, get) => ({
  recipes: [],
  activeRecipe: null,
  filters: { ...defaultFilters },
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const query: RecipeQuery = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.search) query.search = filters.search;
      if (filters.tag) query.tag = filters.tag;
      if (filters.difficulty) query.difficulty = filters.difficulty;
      if (filters.maxTime) query.maxTime = filters.maxTime;

      const response = await recipesApi.fetchRecipes(query);
      set({
        recipes: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load recipes', isLoading: false });
    }
  },

  fetchRecipeById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const recipe = await recipesApi.fetchRecipeById(id);
      set({ activeRecipe: recipe, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load recipe', isLoading: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  clearFilters: () => {
    set({ filters: { ...defaultFilters }, pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
  },

  createRecipe: async (data) => {
    const recipe = await recipesApi.createRecipe(data);
    set((state) => ({ recipes: [recipe, ...state.recipes] }));
    return recipe;
  },

  updateRecipe: async (id, data) => {
    const updated = await recipesApi.updateRecipe(id, data);
    set((state) => ({
      recipes: state.recipes.map((r) => (r.id === id ? updated : r)),
      activeRecipe: state.activeRecipe?.id === id ? updated : state.activeRecipe,
    }));
    return updated;
  },

  deleteRecipe: async (id) => {
    await recipesApi.deleteRecipe(id);
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== id),
      activeRecipe: state.activeRecipe?.id === id ? null : state.activeRecipe,
    }));
  },

  clearActiveRecipe: () => set({ activeRecipe: null }),
}));
