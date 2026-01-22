import Redis from 'ioredis';

import { config } from '@/config';

const redisOptions = {
  lazyConnect: true,
  keyPrefix: config.redisKeyPrefix,
  maxRetriesPerRequest: 1,
  enableReadyCheck: true,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

export const redisClient = config.redisUrl
  ? new Redis(config.redisUrl, redisOptions)
  : new Redis(redisOptions);

redisClient.on('error', (error: Error) => {
  console.error('Redis client error', error);
});
