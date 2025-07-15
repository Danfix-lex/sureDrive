import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err); // Make sure this line is present
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}; 