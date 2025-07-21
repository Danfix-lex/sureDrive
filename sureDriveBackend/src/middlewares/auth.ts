import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    (req as any).user = decoded;
  next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !roles.includes(user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden: insufficient privileges' });
  }
  next();
}; 