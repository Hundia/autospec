import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? '',
  redisKeyPrefix: process.env.REDIS_KEY_PREFIX ?? 'datahub:',
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
