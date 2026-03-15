import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  instructions: text('instructions').notNull(),
  prepTimeMinutes: integer('prep_time_minutes').notNull(),
  cookTimeMinutes: integer('cook_time_minutes').notNull(),
  servings: integer('servings').notNull().default(4),
  difficulty: difficultyEnum('difficulty').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  caloriesPerServing: integer('calories_per_serving'),
  proteinGrams: decimal('protein_grams', { precision: 6, scale: 1 }),
  carbsGrams: decimal('carbs_grams', { precision: 6, scale: 1 }),
  fatGrams: decimal('fat_grams', { precision: 6, scale: 1 }),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations are defined in schema/index.ts to avoid circular imports

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
