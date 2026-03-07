import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    const errorDetails = err.details ? { details: err.details } : {};

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...errorDetails,
      },
    });
    return;
  }

  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
