import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const ingredientCategoryEnum = pgEnum('ingredient_category', [
  'produce',
  'dairy',
  'meat',
  'pantry',
  'frozen',
  'other',
]);

export const ingredients = pgTable('ingredients', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 100 }).notNull().unique(),
  category: ingredientCategoryEnum('category').notNull().default('other'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
