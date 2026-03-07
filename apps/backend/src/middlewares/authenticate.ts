import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
