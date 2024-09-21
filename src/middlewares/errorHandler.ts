import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

// Define a custom error interface that extends the built-in Error interface
interface CustomError extends Error {
  name: string; // Ensure 'name' is always a string
}

// Error handling middleware
export const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction): void => {
  console.log(err.name);

  if (err.name === 'UnauthorizedError') {
    res.status(httpStatus.UNAUTHORIZED).json({
      error: err.message,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      error: err.message,
    });
    return;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    error: err.message,
  });
};
