import {
  createMeeting,
  getMeetingById,
  getMeetings,
  updateMeeting,
  deleteMeeting,
  addFeedback,
} from '../../src/services/meeting.service';
import { Meeting } from '../../src/models/Meeting';
import { User } from '../../src/models/User';
import { NotFoundError, ForbiddenError } from '../../src/utils/errors';
import { setupTestDB, teardownTestDB, clearDB } from '../helpers/db';
import mongoose from 'mongoose';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearDB();
});

const futureDate = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();

const validMeetingInput = () => ({
  title: 'Interview Meeting',
  candidateName: 'Alice Smith',
  position: 'Software Engineer',
  startTime: futureDate(60 * 60 * 1000),
  endTime: futureDate(2 * 60 * 60 * 1000),
  meetingType: 'online' as const,
  platform: 'Zoom',
  status: 'pending' as const,
});

let userCounter = 0;
async function createTestUser(role: 'recruiter' | 'interviewer' | 'admin' = 'recruiter') {
  userCounter++;
  return User.create({
    email: `${role}-${userCounter}@test.local`,
    password: 'hashedpassword',
    fullName: `Test ${role}`,
    role,
    userType: 'user',
  });
}

describe('createMeeting', () => {
  it('should create a meeting and associate with user', async () => {
    const user = await createTestUser();
    const meeting = await createMeeting(validMeetingInput(), user._id.toString());

    expect(meeting.candidateName).toBe('Alice Smith');
    expect(meeting.position).toBe('Software Engineer');
    expect(meeting.status).toBe('pending');
    expect(meeting.createdBy.toString()).toBe(user._id.toString());
  });

  it('should always set status to pending on create', async () => {
    const user = await createTestUser();
    const input = { ...validMeetingInput(), status: 'confirmed' as const };
    const meeting = await createMeeting(input, user._id.toString());

    expect(meeting.status).toBe('pending');
  });

  it('should store startTime and endTime as Dates', async () => {
    const user = await createTestUser();
    const meeting = await createMeeting(validMeetingInput(), user._id.toString());

    expect(meeting.startTime).toBeInstanceOf(Date);
    expect(meeting.endTime).toBeInstanceOf(Date);
  });
});

describe('getMeetingById', () => {
  it('should return meeting with populated createdBy', async () => {
    const user = await createTestUser();
    const created = await createMeeting(validMeetingInput(), user._id.toString());

    const meeting = await getMeetingById(created._id.toString(), user._id.toString(), 'recruiter');

    expect(meeting._id.toString()).toBe(created._id.toString());
    expect((meeting.createdBy as any).fullName).toBe(user.fullName);
  });

  it('should throw NotFoundError for non-existent id', async () => {
    const user = await createTestUser();
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(getMeetingById(fakeId, user._id.toString(), 'recruiter')).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError for invalid id format', async () => {
    await expect(getMeetingById('invalid-id', 'any', 'recruiter')).rejects.toThrow();
  });
});

describe('getMeetings', () => {
  let testUserId: string;

  beforeEach(async () => {
    const user = await createTestUser();
    testUserId = user._id.toString();

    await Meeting.create([
      {
        ...validMeetingInput(),
        candidateName: 'Alice Smith',
        status: 'pending',
        createdBy: testUserId,
      },
      {
        ...validMeetingInput(),
        candidateName: 'Bob Jones',
        status: 'confirmed',
        createdBy: testUserId,
      },
      {
        ...validMeetingInput(),
        candidateName: 'Carol White',
        status: 'cancelled',
        createdBy: testUserId,
      },
    ]);
  });

  it('should return paginated results', async () => {
    const result = await getMeetings({ page: 1, limit: 2 }, testUserId, 'recruiter');

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(3);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(false);
  });

  it('should return second page correctly', async () => {
    const result = await getMeetings({ page: 2, limit: 2 }, testUserId, 'recruiter');

    expect(result.data).toHaveLength(1);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(true);
  });

  it('should filter by status', async () => {
    const result = await getMeetings({ status: 'pending' }, testUserId, 'recruiter');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].status).toBe('pending');
  });

  it('should return all meetings without filter', async () => {
    const result = await getMeetings({}, testUserId, 'recruiter');
    expect(result.pagination.total).toBe(3);
  });

  it('should default page to 1 and limit to 10', async () => {
    const result = await getMeetings({}, testUserId, 'recruiter');
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });
});

describe('updateMeeting', () => {
  it('should update meeting fields for owner', async () => {
    const user = await createTestUser();
    const created = await createMeeting(validMeetingInput(), user._id.toString());

    const updated = await updateMeeting(
      created._id.toString(),
      { candidateName: 'Updated Name' },
      user._id.toString(),
      'recruiter',
    );

    expect(updated.candidateName).toBe('Updated Name');
  });

  it('should allow admin to update any meeting', async () => {
    const owner = await createTestUser('recruiter');
    const admin = await createTestUser('admin');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    const updated = await updateMeeting(
      created._id.toString(),
      { candidateName: 'Admin Updated' },
      admin._id.toString(),
      'admin',
    );

    expect(updated.candidateName).toBe('Admin Updated');
  });

  it('should throw ForbiddenError when non-owner tries to update', async () => {
    const owner = await createTestUser('recruiter');
    const other = await createTestUser('recruiter');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    await expect(
      updateMeeting(
        created._id.toString(),
        { candidateName: 'Hacked Name' },
        other._id.toString(),
        'recruiter',
      ),
    ).rejects.toThrow(ForbiddenError);
  });

  it('should throw NotFoundError for non-existent meeting', async () => {
    const user = await createTestUser();
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(
      updateMeeting(fakeId, { candidateName: 'Name' }, user._id.toString(), 'recruiter'),
    ).rejects.toThrow(NotFoundError);
  });

  it('should update startTime and endTime as Dates', async () => {
    const user = await createTestUser();
    const created = await createMeeting(validMeetingInput(), user._id.toString());
    const newStart = futureDate(3 * 60 * 60 * 1000);
    const newEnd = futureDate(4 * 60 * 60 * 1000);

    const updated = await updateMeeting(
      created._id.toString(),
      { startTime: newStart, endTime: newEnd },
      user._id.toString(),
      'recruiter',
    );

    expect(updated.startTime).toBeInstanceOf(Date);
    expect(updated.endTime).toBeInstanceOf(Date);
  });
});

describe('deleteMeeting', () => {
  it('should delete meeting for owner', async () => {
    const user = await createTestUser();
    const created = await createMeeting(validMeetingInput(), user._id.toString());

    await deleteMeeting(created._id.toString(), user._id.toString(), 'recruiter');

    const found = await Meeting.findById(created._id);
    expect(found).toBeNull();
  });

  it('should allow admin to delete any meeting', async () => {
    const owner = await createTestUser('recruiter');
    const admin = await createTestUser('admin');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    await deleteMeeting(created._id.toString(), admin._id.toString(), 'admin');

    const found = await Meeting.findById(created._id);
    expect(found).toBeNull();
  });

  it('should throw ForbiddenError when non-owner tries to delete', async () => {
    const owner = await createTestUser('recruiter');
    const other = await createTestUser('recruiter');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    await expect(
      deleteMeeting(created._id.toString(), other._id.toString(), 'recruiter'),
    ).rejects.toThrow(ForbiddenError);
  });

  it('should throw NotFoundError for non-existent meeting', async () => {
    const user = await createTestUser();
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(deleteMeeting(fakeId, user._id.toString(), 'recruiter')).rejects.toThrow(
      NotFoundError,
    );
  });
});

describe('addFeedback', () => {
  it('should allow interviewer to add feedback', async () => {
    const owner = await createTestUser('recruiter');
    const interviewer = await createTestUser('interviewer');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    const updated = await addFeedback(
      created._id.toString(),
      { topic: 'Technical Skills', comment: 'Great candidate with excellent skills', rating: 5 },
      interviewer._id.toString(),
      'interviewer',
    );

    expect(updated.feedback).toHaveLength(1);
    expect(updated.feedback[0].comment).toBe('Great candidate with excellent skills');
    expect(updated.feedback[0].rating).toBe(5);
  });

  it('should allow admin to add feedback', async () => {
    const owner = await createTestUser('recruiter');
    const admin = await createTestUser('admin');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    const updated = await addFeedback(
      created._id.toString(),
      { topic: 'Culture Fit', comment: 'Admin feedback on the candidate', rating: 4 },
      admin._id.toString(),
      'admin',
    );

    expect(updated.feedback).toHaveLength(1);
  });

  it('should allow recruiter to add feedback', async () => {
    const owner = await createTestUser('recruiter');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    const updated = await addFeedback(
      created._id.toString(),
      { topic: 'Communication', comment: 'Recruiter feedback on the candidate', rating: 3 },
      owner._id.toString(),
      'recruiter',
    );

    expect(updated.feedback).toHaveLength(1);
    expect(updated.feedback[0].rating).toBe(3);
  });

  it('should throw NotFoundError for non-existent meeting', async () => {
    const interviewer = await createTestUser('interviewer');
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(
      addFeedback(
        fakeId,
        { topic: 'General', comment: 'Feedback for missing meeting here', rating: 3 },
        interviewer._id.toString(),
        'interviewer',
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should accumulate multiple feedback entries', async () => {
    const owner = await createTestUser('recruiter');
    const interviewer1 = await createTestUser('interviewer');
    const interviewer2 = await createTestUser('interviewer');
    const created = await createMeeting(validMeetingInput(), owner._id.toString());

    await addFeedback(
      created._id.toString(),
      { topic: 'Problem Solving', comment: 'First interviewer solid performance overall', rating: 4 },
      interviewer1._id.toString(),
      'interviewer',
    );
    const final = await addFeedback(
      created._id.toString(),
      { topic: 'Leadership', comment: 'Second interviewer additional perspective here', rating: 5 },
      interviewer2._id.toString(),
      'interviewer',
    );

    expect(final.feedback).toHaveLength(2);
  });
});
