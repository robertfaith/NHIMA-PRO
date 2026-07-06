import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Unhandled error:', err);

  // Auth0 JWT errors
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      message: 'Unauthorized — invalid or missing token',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
};