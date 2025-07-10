import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT authentication
  next();
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement role-based authorization
  next();
}; 