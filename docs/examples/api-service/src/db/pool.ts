import { Pool } from 'pg';

import { config } from '@/config';

export const pool = new Pool({
  connectionString: config.databaseUrl || undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error: Error) => {
  console.error('Unexpected database pool error', error);
});
