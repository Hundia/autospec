import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Also try parent directory
if (!process.env['DATABASE_URL']) {
  dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
}

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is required. Copy .env.example to .env and set DATABASE_URL.'
  );
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
