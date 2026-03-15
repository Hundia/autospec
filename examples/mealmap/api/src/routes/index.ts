import { Router } from 'express';
import { healthRouter } from './health.routes.js';

// Routes will be added here as sprints progress:
// import { authRouter } from './auth.routes.js';
// import { recipesRouter } from './recipes.routes.js';
// import { ingredientsRouter } from './ingredients.routes.js';
// import { mealPlansRouter } from './mealPlans.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

// Sprint 1+ routes:
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/recipes', authMiddleware, recipesRouter);
// apiRouter.use('/ingredients', authMiddleware, ingredientsRouter);
// apiRouter.use('/meal-plans', authMiddleware, mealPlansRouter);
