import { Meeting, IMeetingDocument } from '../models/Meeting';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type { CreateMeetingInput, UpdateMeetingInput, AddFeedbackInput } from '../validators/meeting.validator';
import type { FilterQuery, SortOrder } from 'mongoose';

export interface MeetingListQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: 'startTime' | 'createdAt' | 'candidateName';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface PaginatedMeetings {
  data: IMeetingDocument[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function createMeeting(
  input: CreateMeetingInput,
  userId: string,
): Promise<IMeetingDocument> {
  const meeting = await Meeting.create({
    ...input,
    startTime: new Date(input.startTime),
    endTime: new Date(input.endTime),
    status: 'pending',
    createdBy: userId,
  });
  return meeting;
}

export async function getMeetingById(id: string): Promise<IMeetingDocument> {
  const meeting = await Meeting.findById(id)
    .populate('createdBy', 'fullName email role')
    .populate('feedback.interviewerId', 'fullName email role');

  if (!meeting) {
    throw new NotFoundError('MEETING_NOT_FOUND', 'Meeting not found');
  }
  return meeting;
}

export async function getMeetings(query: MeetingListQuery): Promise<PaginatedMeetings> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const filter: FilterQuery<IMeetingDocument> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.startDate || query.endDate) {
    filter.startTime = {};
    if (query.startDate) filter.startTime.$gte = new Date(query.startDate);
    if (query.endDate) filter.startTime.$lte = new Date(query.endDate);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortDir: SortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, SortOrder> = { [sortField]: sortDir };

  const [data, total] = await Promise.all([
    Meeting.find(filter).sort(sort).skip(skip).limit(limit).populate('createdBy', 'fullName email role'),
    Meeting.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function updateMeeting(
  id: string,
  input: UpdateMeetingInput,
  userId: string,
  userRole: string,
): Promise<IMeetingDocument> {
  const meeting = await Meeting.findById(id);
  if (!meeting) {
    throw new NotFoundError('MEETING_NOT_FOUND', 'Meeting not found');
  }

  if (meeting.createdBy.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have permission to update this meeting');
  }

  const updates: Partial<IMeetingDocument> = { ...input } as Partial<IMeetingDocument>;
  if (input.startTime) updates.startTime = new Date(input.startTime);
  if (input.endTime) updates.endTime = new Date(input.endTime);

  Object.assign(meeting, updates);
  await meeting.save();

  return meeting;
}

export async function deleteMeeting(
  id: string,
  userId: string,
  userRole: string,
): Promise<void> {
  const meeting = await Meeting.findById(id);
  if (!meeting) {
    throw new NotFoundError('MEETING_NOT_FOUND', 'Meeting not found');
  }

  if (meeting.createdBy.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('You do not have permission to delete this meeting');
  }

  await meeting.deleteOne();
}

export async function addFeedback(
  id: string,
  input: AddFeedbackInput,
  userId: string,
  userRole: string,
): Promise<IMeetingDocument> {
  if (userRole !== 'interviewer' && userRole !== 'admin') {
    throw new ForbiddenError('Only interviewers can add feedback');
  }

  const meeting = await Meeting.findById(id);
  if (!meeting) {
    throw new NotFoundError('MEETING_NOT_FOUND', 'Meeting not found');
  }

  meeting.feedback.push({
    interviewerId: userId,
    comment: input.comment,
    rating: input.rating,
  } as never);

  await meeting.save();

  await meeting.populate('feedback.interviewerId', 'fullName email role');
  return meeting;
}
