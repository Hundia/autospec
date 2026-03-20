import { Router } from 'express';

import { checkDatabase } from '@/db';
import { checkRedis } from '@/redis';

export const healthRoutes = Router();

healthRoutes.get('/', (_request, response) => {
  response.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

healthRoutes.get('/ready', async (_request, response) => {
  const [databaseOk, redisOk] = await Promise.all([checkDatabase(), checkRedis()]);
  const status = databaseOk && redisOk ? 'ready' : 'not_ready';
  const httpStatus = databaseOk && redisOk ? 200 : 503;

  response.status(httpStatus).json({
    status,
    checks: {
      database: databaseOk ? 'connected' : 'disconnected',
      redis: redisOk ? 'connected' : 'disconnected',
    },
    timestamp: new Date().toISOString(),
  });
});

healthRoutes.get('/live', (_request, response) => {
  response.status(200).json({
    status: 'alive',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
