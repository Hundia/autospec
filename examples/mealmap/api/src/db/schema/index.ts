import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { recipes } from './recipes.js';
import { ingredients } from './ingredients.js';
import { recipeIngredients } from './recipeIngredients.js';
import { mealPlans } from './mealPlans.js';
import { mealPlanEntries } from './mealPlanEntries.js';

// Define all relations here to avoid circular imports between schema files

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  mealPlans: many(mealPlans),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, { fields: [recipes.userId], references: [users.id] }),
  recipeIngredients: many(recipeIngredients),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
  ingredient: one(ingredients, {
    fields: [recipeIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export const mealPlansRelations = relations(mealPlans, ({ one, many }) => ({
  user: one(users, { fields: [mealPlans.userId], references: [users.id] }),
  entries: many(mealPlanEntries),
}));

export const mealPlanEntriesRelations = relations(mealPlanEntries, ({ one }) => ({
  mealPlan: one(mealPlans, {
    fields: [mealPlanEntries.mealPlanId],
    references: [mealPlans.id],
  }),
  recipe: one(recipes, {
    fields: [mealPlanEntries.recipeId],
    references: [recipes.id],
  }),
}));

// Re-export all tables and types
export * from './users.js';
export * from './ingredients.js';
export * from './recipes.js';
export * from './recipeIngredients.js';
export * from './mealPlans.js';
export * from './mealPlanEntries.js';
