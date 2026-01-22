import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler } from '@/middleware/errorHandler';
import { routes } from '@/routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(routes);

app.use(errorHandler);
