import { z } from 'zod';

const futureDate = z
  .string()
  .datetime({ message: 'Must be a valid ISO datetime' })
  .refine((val) => new Date(val) > new Date(), { message: 'Date must be in the future' });

export const createMeetingSchema = z
  .object({
    candidateName: z
      .string()
      .min(2, 'Candidate name must be at least 2 characters')
      .max(100, 'Candidate name must not exceed 100 characters'),
    position: z
      .string()
      .min(2, 'Position must be at least 2 characters')
      .max(100, 'Position must not exceed 100 characters'),
    startTime: futureDate,
    endTime: z.string().datetime({ message: 'Must be a valid ISO datetime' }),
    meetingType: z.enum(['online', 'onsite']),
    platform: z.string().trim().optional(),
    meetingLink: z.string().url('Must be a valid URL').optional(),
    status: z
      .enum(['pending', 'confirmed', 'cancelled', 'completed'])
      .optional()
      .default('pending'),
    notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine((data) => data.meetingType !== 'online' || !!data.platform, {
    message: 'Platform is required for online meetings',
    path: ['platform'],
  });

export const updateMeetingSchema = z
  .object({
    candidateName: z
      .string()
      .min(2, 'Candidate name must be at least 2 characters')
      .max(100, 'Candidate name must not exceed 100 characters')
      .optional(),
    position: z
      .string()
      .min(2, 'Position must be at least 2 characters')
      .max(100, 'Position must not exceed 100 characters')
      .optional(),
    startTime: z.string().datetime({ message: 'Must be a valid ISO datetime' }).optional(),
    endTime: z.string().datetime({ message: 'Must be a valid ISO datetime' }).optional(),
    meetingType: z.enum(['online', 'onsite']).optional(),
    platform: z.string().trim().optional(),
    meetingLink: z.string().url('Must be a valid URL').optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
    notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    { message: 'End time must be after start time', path: ['endTime'] },
  );

export const addFeedbackSchema = z.object({
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(2000, 'Comment must not exceed 2000 characters'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
});

export const meetingQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1, 'Page must be at least 1')),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100, 'Limit must not exceed 100')),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['startTime', 'createdAt', 'candidateName']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  startDate: z.string().datetime({ message: 'startDate must be a valid ISO datetime' }).optional(),
  endDate: z.string().datetime({ message: 'endDate must be a valid ISO datetime' }).optional(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
export type AddFeedbackInput = z.infer<typeof addFeedbackSchema>;
export type MeetingQueryInput = z.infer<typeof meetingQuerySchema>;
