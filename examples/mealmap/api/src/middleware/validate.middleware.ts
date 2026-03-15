import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    // Replace source with parsed (and potentially transformed/defaulted) data
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}
