import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
