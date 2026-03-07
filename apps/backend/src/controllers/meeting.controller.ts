import { Response, NextFunction } from 'express';
import * as meetingService from '../services/meeting.service';
import {
  createMeetingSchema,
  updateMeetingSchema,
  addFeedbackSchema,
  meetingQuerySchema,
} from '../validators/meeting.validator';
import { ValidationError } from '../utils/errors';
import type { AuthRequest } from '../middlewares/authenticate';

function parseZodError(error: import('zod').ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}

export async function getMeetings(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = meetingQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const result = await meetingService.getMeetings(parsed.data);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getMeetingById(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const meeting = await meetingService.getMeetingById(String(req.params.id));
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    next(err);
  }
}

export async function createMeeting(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createMeetingSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const meeting = await meetingService.createMeeting(parsed.data, req.user!.id);
    res.status(201).json({ success: true, data: meeting });
  } catch (err) {
    next(err);
  }
}

export async function updateMeeting(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateMeetingSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const meeting = await meetingService.updateMeeting(
      String(req.params.id),
      parsed.data,
      req.user!.id,
      req.user!.role,
    );
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    next(err);
  }
}

export async function deleteMeeting(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await meetingService.deleteMeeting(String(req.params.id), req.user!.id, req.user!.role);
    res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function addFeedback(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = addFeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parseZodError(parsed.error));
    }
    const meeting = await meetingService.addFeedback(
      String(req.params.id),
      parsed.data,
      req.user!.id,
      req.user!.role,
    );
    res.status(201).json({ success: true, data: meeting });
  } catch (err) {
    next(err);
  }
}
