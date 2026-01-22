import { config } from '@/config';
import { pool } from '@/db/pool';

export const checkDatabase = async (): Promise<boolean> => {
  if (!config.databaseUrl) {
    return false;
  }

  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed', error);
    return false;
  }
};

export { pool };
