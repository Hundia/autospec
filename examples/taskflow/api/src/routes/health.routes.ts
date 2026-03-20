import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
