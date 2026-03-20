import { config } from '@/config';
import { redisClient } from '@/redis/client';

export const checkRedis = async (): Promise<boolean> => {
  if (!config.redisUrl) {
    return false;
  }

  try {
    const response = await redisClient.ping();
    return response === 'PONG';
  } catch (error) {
    console.error('Redis health check failed', error);
    return false;
  }
};

export { redisClient };
