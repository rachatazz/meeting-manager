import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  role: z.enum(['recruiter', 'interviewer', 'admin']).optional().default('recruiter'),
});

export const guestRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  fingerprint: z.string().min(1, 'Fingerprint is required'),
});

export const guestLoginSchema = z.object({
  fingerprint: z.string().min(1, 'Fingerprint is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type GuestRegisterInput = z.infer<typeof guestRegisterSchema>;
export type GuestLoginInput = z.infer<typeof guestLoginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
