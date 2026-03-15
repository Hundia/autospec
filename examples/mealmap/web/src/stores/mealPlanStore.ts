import { create } from 'zustand';
import * as mealPlansApi from '../api/mealPlans.api.ts';
import * as entriesApi from '../api/mealPlanEntries.api.ts';
import type {
  MealPlan,
  MealPlanWithEntries,
  CreateMealPlanDto,
  CreateEntryDto,
} from '../types/mealPlan.types.ts';

interface MealPlanState {
  plans: MealPlan[];
  activePlan: MealPlanWithEntries | null;
  isLoading: boolean;
  error: string | null;

  fetchPlans: () => Promise<void>;
  fetchPlanWithEntries: (id: string) => Promise<void>;
  createPlan: (data: CreateMealPlanDto) => Promise<MealPlan>;
  updatePlan: (id: string, data: Partial<CreateMealPlanDto>) => Promise<void>;
  activatePlan: (id: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addEntry: (planId: string, data: CreateEntryDto) => Promise<void>;
  removeEntry: (planId: string, entryId: string) => Promise<void>;
}

export const useMealPlanStore = create<MealPlanState>()((set, get) => ({
  plans: [],
  activePlan: null,
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await mealPlansApi.fetchMealPlans();
      set({ plans: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load meal plans',
        isLoading: false,
      });
    }
  },

  fetchPlanWithEntries: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const plan = await mealPlansApi.fetchMealPlanById(id);
      set({ activePlan: plan, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load meal plan',
        isLoading: false,
      });
    }
  },

  createPlan: async (data) => {
    const plan = await mealPlansApi.createMealPlan(data);
    set((state) => ({ plans: [...state.plans, plan] }));
    return plan;
  },

  updatePlan: async (id, data) => {
    const updated = await mealPlansApi.updateMealPlan(id, data);
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? updated : p)),
    }));
  },

  activatePlan: async (id) => {
    await mealPlansApi.activateMealPlan(id);
    // Refetch all plans to get updated isActive states
    await get().fetchPlans();
  },

  deletePlan: async (id) => {
    await mealPlansApi.deleteMealPlan(id);
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
      activePlan: state.activePlan?.id === id ? null : state.activePlan,
    }));
  },

  addEntry: async (planId, data) => {
    const entry = await entriesApi.addEntry(planId, data);
    set((state) => ({
      activePlan:
        state.activePlan?.id === planId
          ? { ...state.activePlan, entries: [...state.activePlan.entries, entry] }
          : state.activePlan,
    }));
  },

  removeEntry: async (planId, entryId) => {
    await entriesApi.removeEntry(planId, entryId);
    set((state) => ({
      activePlan:
        state.activePlan?.id === planId
          ? {
              ...state.activePlan,
              entries: state.activePlan.entries.filter((e) => e.id !== entryId),
            }
          : state.activePlan,
    }));
  },
}));
