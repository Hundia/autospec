import { Router } from 'express';

import { healthRoutes } from '@/routes/health';

export const routes = Router();

routes.use('/health', healthRoutes);
