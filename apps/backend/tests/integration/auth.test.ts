import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/models/User';
import { setupTestDB, teardownTestDB } from '../helpers/db';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const validUser = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  fullName: 'Test User',
  role: 'recruiter',
};

describe('POST /api/v1/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validUser).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.fullName).toBe(validUser.fullName);
    expect(res.body.data.user.role).toBe(validUser.role);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 400 for duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send(validUser);
    const res = await request(app).post('/api/v1/auth/register').send(validUser).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: 'invalid-email' })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.details[0].field).toBe('email');
  });

  it('should return 400 for weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: 'weak' })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('password');
  });
});

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(validUser);
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: validUser.email, password: 'WrongPassword123!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'SecurePass123!' })
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe('POST /api/v1/auth/refresh', () => {
  it('should refresh access token successfully', async () => {
    const loginRes = await request(app).post('/api/v1/auth/register').send(validUser);
    const { refreshToken } = loginRes.body.data;

    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken }).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should return 401 for invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'invalid-token' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/v1/auth/register/guest', () => {
  const validGuest = {
    fullName: 'Guest User',
    fingerprint: 'test-fingerprint-abc123',
  };

  it('should register a new guest successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register/guest').send(validGuest).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.fullName).toBe(validGuest.fullName);
    expect(res.body.data.user.email).toBeNull();
    expect(res.body.data.user.role).toBe('recruiter');
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.fingerprint).toBeUndefined();
  });

  it('should return 400 for duplicate fingerprint', async () => {
    await request(app).post('/api/v1/auth/register/guest').send(validGuest);

    const res = await request(app).post('/api/v1/auth/register/guest').send(validGuest).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details[0].field).toBe('fingerprint');
  });

  it('should return 400 for missing fullName', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fingerprint: 'some-fingerprint' })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.details[0].field).toBe('fullName');
  });

  it('should return 400 for missing fingerprint', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fullName: 'Guest User' })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.details[0].field).toBe('fingerprint');
  });

  it('should return 400 for fullName too short', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fullName: 'A', fingerprint: 'some-fingerprint' })
      .expect(400);

    expect(res.body.error.details[0].field).toBe('fullName');
  });
});

describe('POST /api/v1/auth/login/guest', () => {
  const validGuest = {
    fullName: 'Guest User',
    fingerprint: 'login-fingerprint-xyz789',
  };

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register/guest').send(validGuest);
  });

  it('should login guest successfully with valid fingerprint', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: validGuest.fingerprint })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.fullName).toBe(validGuest.fullName);
    expect(res.body.data.user.email).toBeNull();
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.fingerprint).toBeUndefined();
  });

  it('should return 401 for unknown fingerprint', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: 'non-existent-fingerprint' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 400 for missing fingerprint', async () => {
    const res = await request(app).post('/api/v1/auth/login/guest').send({}).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.details[0].field).toBe('fingerprint');
  });

  it('should issue new tokens on each guest login', async () => {
    const first = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: validGuest.fingerprint });

    await new Promise((r) => setTimeout(r, 1100));

    const second = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: validGuest.fingerprint });

    expect(first.body.data.accessToken).not.toBe(second.body.data.accessToken);
    expect(first.body.data.refreshToken).not.toBe(second.body.data.refreshToken);
  });

  it('new guest refresh token should be usable', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: validGuest.fingerprint });

    const { refreshToken } = loginRes.body.data;

    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken }).expect(200);

    expect(res.body.data.accessToken).toBeDefined();
  });
});

describe('POST /api/v1/auth/login (guest rejection)', () => {
  it('should return 401 when guest account tries to login via regular login', async () => {
    await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fullName: 'Guest', fingerprint: 'reject-fingerprint-001' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'anything@example.com', password: 'SecurePass123!' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('should logout successfully', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
    const { accessToken, refreshToken } = registerRes.body.data;

    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logged out successfully');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).post('/api/v1/auth/logout').expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
