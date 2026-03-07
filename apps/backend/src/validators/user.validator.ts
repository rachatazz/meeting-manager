import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
  role: z.enum(['recruiter', 'interviewer', 'admin']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
