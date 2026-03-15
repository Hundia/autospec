import { pgTable, uuid, decimal, varchar, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { recipes } from './recipes.js';
import { ingredients } from './ingredients.js';

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id),
    quantity: decimal('quantity', { precision: 8, scale: 2 }).notNull(),
    unit: varchar('unit', { length: 20 }).notNull(),
  },
  (table) => ({
    uniqRecipeIngredient: unique().on(table.recipeId, table.ingredientId),
  })
);

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type NewRecipeIngredient = typeof recipeIngredients.$inferInsert;
