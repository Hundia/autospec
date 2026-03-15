import { pgTable, uuid, date, integer, unique, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { mealPlans } from './mealPlans.js';
import { recipes } from './recipes.js';

export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

export const mealPlanEntries = pgTable(
  'meal_plan_entries',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    mealPlanId: uuid('meal_plan_id')
      .notNull()
      .references(() => mealPlans.id, { onDelete: 'cascade' }),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id),
    date: date('date').notNull(),
    mealType: mealTypeEnum('meal_type').notNull(),
    servingsOverride: integer('servings_override'),
  },
  (table) => ({
    uniqSlot: unique().on(table.mealPlanId, table.date, table.mealType),
  })
);

export type MealPlanEntry = typeof mealPlanEntries.$inferSelect;
export type NewMealPlanEntry = typeof mealPlanEntries.$inferInsert;
