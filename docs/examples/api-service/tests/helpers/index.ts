export const getTestDatabaseUrl = (): string =>
  process.env.TEST_DATABASE_URL ?? 'postgresql://datahub:datahub@localhost:5432/datahub_test';

export const getTestRedisUrl = (): string => process.env.TEST_REDIS_URL ?? 'redis://localhost:6379';

export const setTestEnv = (): void => {
  process.env.NODE_ENV = 'test';
  process.env.TEST_DATABASE_URL = getTestDatabaseUrl();
  process.env.TEST_REDIS_URL = getTestRedisUrl();
};
