import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import type { AuthRequest } from './authenticate';

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(`Role '${req.user.role}' is not allowed to perform this action`));
      return;
    }
    next();
  };
}
