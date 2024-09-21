// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      role?: string;
    }
  }
}


import { Request, Response, NextFunction } from 'express';

// Define the type for the roles parameter
type Roles = string[];

// Middleware function to check roles
export const authorize = (roles: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.role || '')) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
