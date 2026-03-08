import request from 'supertest';
import { app } from '../../src/app';
import { setupTestDB, teardownTestDB, clearDB } from '../helpers/db';

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

const validMeeting = () => ({
  title: 'Interview Meeting',
  candidateName: 'Alice Smith',
  position: 'Software Engineer',
  startTime: futureDate(60 * 60 * 1000),
  endTime: futureDate(2 * 60 * 60 * 1000),
  meetingType: 'online',
  platform: 'Zoom',
});

let userCounter = 0;
async function registerAndLogin(role: 'recruiter' | 'interviewer' | 'admin' = 'recruiter') {
  userCounter++;
  const email = `${role}-${userCounter}@test.local`;
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password: 'SecurePass123!', fullName: `Test ${role}`, role });
  if (!res.body.data) {
    throw new Error(`registerAndLogin failed: ${JSON.stringify(res.body)}`);
  }
  return {
    accessToken: res.body.data.accessToken as string,
    userId: res.body.data.user.id as string,
  };
}

describe('POST /api/v1/meetings', () => {
  it('should create a meeting for authenticated user', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validMeeting())
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.candidateName).toBe('Alice Smith');
    expect(res.body.data.status).toBe('pending');
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).post('/api/v1/meetings').send(validMeeting()).expect(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 400 for missing required fields', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ candidateName: 'Alice' })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 when endTime is before startTime', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...validMeeting(),
        startTime: futureDate(2 * 60 * 60 * 1000),
        endTime: futureDate(60 * 60 * 1000),
      })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('endTime');
  });

  it('should return 400 when startTime is in the past', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...validMeeting(),
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('startTime');
  });

  it('should return 400 for online meeting without platform', async () => {
    const { accessToken } = await registerAndLogin();
    const { platform: _, ...meeting } = validMeeting();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...meeting, meetingType: 'online' })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('platform');
  });

  it('should allow onsite meeting without platform', async () => {
    const { accessToken } = await registerAndLogin();
    const { platform: _, ...meeting } = validMeeting();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...meeting, meetingType: 'onsite' })
      .expect(201);

    expect(res.body.success).toBe(true);
  });

  it('should always set status to pending on create', async () => {
    const { accessToken } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...validMeeting(), status: 'confirmed' })
      .expect(201);

    expect(res.body.data.status).toBe('pending');
  });
});

describe('GET /api/v1/meetings', () => {
  let accessToken: string;

  beforeEach(async () => {
    const auth = await registerAndLogin();
    accessToken = auth.accessToken;

    await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...validMeeting(), candidateName: 'Alice Smith' });

    await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...validMeeting(), candidateName: 'Bob Jones' });

    await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...validMeeting(), candidateName: 'Carol White' });
  });

  it('should return paginated list of meetings', async () => {
    const res = await request(app)
      .get('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(3);
  });

  it('should paginate with page and limit params', async () => {
    const res = await request(app)
      .get('/api/v1/meetings?page=1&limit=2')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.hasNext).toBe(true);
    expect(res.body.pagination.hasPrev).toBe(false);
  });

  it('should filter by status', async () => {
    const res = await request(app)
      .get('/api/v1/meetings?status=pending')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.pagination.total).toBe(3);
    res.body.data.forEach((m: { status: string }) => expect(m.status).toBe('pending'));
  });

  it('should return 401 without authentication', async () => {
    await request(app).get('/api/v1/meetings').expect(401);
  });

  it('should return 400 for invalid query params', async () => {
    const res = await request(app)
      .get('/api/v1/meetings?page=abc')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for invalid status filter', async () => {
    const res = await request(app)
      .get('/api/v1/meetings?status=invalid')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/v1/meetings/:id', () => {
  it('should return a meeting by id', async () => {
    const { accessToken } = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .get(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.createdBy).toBeDefined();
  });

  it('should return 404 for non-existent meeting', async () => {
    const { accessToken } = await registerAndLogin();
    const fakeId = '000000000000000000000000';

    const res = await request(app)
      .get(`/api/v1/meetings/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.error.code).toBe('MEETING_NOT_FOUND');
  });

  it('should return 401 without authentication', async () => {
    await request(app).get('/api/v1/meetings/000000000000000000000000').expect(401);
  });
});

describe('PUT /api/v1/meetings/:id', () => {
  it('should update meeting for owner', async () => {
    const { accessToken } = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ candidateName: 'Updated Alice' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.candidateName).toBe('Updated Alice');
  });

  it('should allow admin to update any meeting', async () => {
    const { accessToken: ownerToken } = await registerAndLogin('recruiter');
    const { accessToken: adminToken } = await registerAndLogin('admin');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ candidateName: 'Admin Updated' })
      .expect(200);

    expect(res.body.data.candidateName).toBe('Admin Updated');
  });

  it('should return 403 when non-owner tries to update', async () => {
    const { accessToken: ownerToken } = await registerAndLogin('recruiter');
    const { accessToken: otherToken } = await registerAndLogin('recruiter');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ candidateName: 'Unauthorized Update' })
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('should return 404 for non-existent meeting', async () => {
    const { accessToken } = await registerAndLogin();
    const fakeId = '000000000000000000000000';

    const res = await request(app)
      .put(`/api/v1/meetings/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ candidateName: 'Name' })
      .expect(404);

    expect(res.body.error.code).toBe('MEETING_NOT_FOUND');
  });

  it('should return 401 without authentication', async () => {
    await request(app)
      .put('/api/v1/meetings/000000000000000000000000')
      .send({ candidateName: 'Name' })
      .expect(401);
  });
});

describe('DELETE /api/v1/meetings/:id', () => {
  it('should delete meeting for owner', async () => {
    const { accessToken } = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .delete(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Meeting deleted successfully');
  });

  it('should allow admin to delete any meeting', async () => {
    const { accessToken: ownerToken } = await registerAndLogin('recruiter');
    const { accessToken: adminToken } = await registerAndLogin('admin');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    await request(app)
      .delete(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should return 403 when non-owner tries to delete', async () => {
    const { accessToken: ownerToken } = await registerAndLogin('recruiter');
    const { accessToken: otherToken } = await registerAndLogin('recruiter');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .delete(`/api/v1/meetings/${id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);

    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('should return 404 for non-existent meeting', async () => {
    const { accessToken } = await registerAndLogin();
    const fakeId = '000000000000000000000000';

    const res = await request(app)
      .delete(`/api/v1/meetings/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(res.body.error.code).toBe('MEETING_NOT_FOUND');
  });

  it('should return 401 without authentication', async () => {
    await request(app).delete('/api/v1/meetings/000000000000000000000000').expect(401);
  });
});

describe('POST /api/v1/meetings/:id/feedback', () => {
  const validFeedback = {
    topic: 'Technical Skills',
    comment: 'Great candidate with excellent technical skills',
    rating: 5,
  };

  it('should allow interviewer to add feedback', async () => {
    const { accessToken: recruiterToken } = await registerAndLogin('recruiter');
    const { accessToken: interviewerToken } = await registerAndLogin('interviewer');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/meetings/${id}/feedback`)
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send(validFeedback)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.feedback).toHaveLength(1);
    expect(res.body.data.feedback[0].comment).toBe(validFeedback.comment);
    expect(res.body.data.feedback[0].rating).toBe(5);
  });

  it('should allow recruiter to add feedback', async () => {
    const { accessToken } = await registerAndLogin('recruiter');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/meetings/${id}/feedback`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validFeedback)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.feedback).toHaveLength(1);
  });

  it('should return 400 for invalid rating (out of range)', async () => {
    const { accessToken: recruiterToken } = await registerAndLogin('recruiter');
    const { accessToken: interviewerToken } = await registerAndLogin('interviewer');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/meetings/${id}/feedback`)
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({ topic: 'Technical Skills', comment: 'Some feedback comment here', rating: 6 })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('rating');
  });

  it('should return 400 for missing topic', async () => {
    const { accessToken: recruiterToken } = await registerAndLogin('recruiter');
    const { accessToken: interviewerToken } = await registerAndLogin('interviewer');

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send(validMeeting());

    const id = createRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/meetings/${id}/feedback`)
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({ comment: 'Some feedback comment here', rating: 4 })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('topic');
  });

  it('should return 404 for non-existent meeting', async () => {
    const { accessToken } = await registerAndLogin('interviewer');
    const fakeId = '000000000000000000000000';

    const res = await request(app)
      .post(`/api/v1/meetings/${fakeId}/feedback`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validFeedback)
      .expect(404);

    expect(res.body.error.code).toBe('MEETING_NOT_FOUND');
  });

  it('should return 401 without authentication', async () => {
    await request(app)
      .post('/api/v1/meetings/000000000000000000000000/feedback')
      .send(validFeedback)
      .expect(401);
  });
});
