import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    (error as { type?: string }).type === 'entity.too.large'
  ) {
    response.status(413).json({
      status: 'error',
      message: 'Payload too large',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof SyntaxError) {
    response.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
};
