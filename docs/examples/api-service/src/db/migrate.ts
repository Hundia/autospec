import fs from 'node:fs';
import path from 'node:path';

import { pool } from '@/db/pool';

type MigrationFile = {
  version: number;
  name: string;
  fileName: string;
  fullPath: string;
};

type AppliedMigration = {
  version: number;
  name: string;
  appliedAt: string;
};

const MIGRATION_PATTERN = /^(\d{3})_(.+)\.sql$/;

const migrationsDir = path.resolve(process.cwd(), 'migrations');

const ensureMigrationsTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const loadMigrationFiles = (): MigrationFile[] => {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  const files = fs.readdirSync(migrationsDir);

  const migrations = files
    .filter((file) => file.endsWith('.sql'))
    .map((fileName) => {
      const match = MIGRATION_PATTERN.exec(fileName);
      if (!match) {
        throw new Error(`Invalid migration filename: ${fileName}`);
      }

      const version = Number.parseInt(match[1], 10);
      const name = match[2];

      return {
        version,
        name,
        fileName,
        fullPath: path.join(migrationsDir, fileName),
      } satisfies MigrationFile;
    })
    .sort((a, b) => a.version - b.version);

  for (let index = 1; index < migrations.length; index += 1) {
    if (migrations[index].version === migrations[index - 1].version) {
      throw new Error(`Duplicate migration version: ${migrations[index].version}`);
    }
  }

  return migrations;
};

const loadAppliedMigrations = async (): Promise<AppliedMigration[]> => {
  const result = await pool.query<AppliedMigration>(
    'SELECT version, name, applied_at AS "appliedAt" FROM schema_migrations ORDER BY version',
  );

  return result.rows;
};

const applyMigration = async (migration: MigrationFile): Promise<void> => {
  const sql = fs.readFileSync(migration.fullPath, 'utf8');

  await pool.query('BEGIN');
  try {
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (version, name) VALUES ($1, $2)', [
      migration.version,
      migration.name,
    ]);
    await pool.query('COMMIT');
    console.info(`Applied migration ${migration.fileName}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

const printStatus = (applied: AppliedMigration[], files: MigrationFile[]): void => {
  const appliedSet = new Set(applied.map((item) => item.version));

  const rows = files.map((file) => ({
    version: file.version,
    name: file.name,
    status: appliedSet.has(file.version) ? 'applied' : 'pending',
  }));

  console.table(rows);
};

const run = async (): Promise<void> => {
  await ensureMigrationsTable();

  const files = loadMigrationFiles();
  const applied = await loadAppliedMigrations();

  if (process.argv[2] === 'status') {
    printStatus(applied, files);
    return;
  }

  const appliedVersions = new Set(applied.map((migration) => migration.version));
  const pending = files.filter((migration) => !appliedVersions.has(migration.version));

  for (const migration of pending) {
    await applyMigration(migration);
  }

  if (pending.length === 0) {
    console.info('No pending migrations');
  }
};

run()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error('Migration failed', error);
    await pool.end();
    process.exitCode = 1;
  });
