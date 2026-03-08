import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import {
  registerSchema,
  guestRegisterSchema,
  guestLoginSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';
import { ValidationError } from '../utils/errors';
import type { AuthRequest } from '../middlewares/authenticate';

function parseZodError(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}

export async function registerGuest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = guestRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await authService.registerGuest(parsed.data);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = guestLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await authService.loginGuest(parsed.data);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await authService.register(parsed.data);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await authService.login(parsed.data);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = refreshTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await authService.refreshAccessToken(parsed.data.refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (req.user && refreshToken) {
      await authService.logout(req.user.id, refreshToken);
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new Error('Unauthorized');
    }
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
