# API Test Cases

## Test Infrastructure

### Setup (mongodb-memory-server)

```typescript
// tests/helpers/db.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../src/config/database';

let mongoServer: MongoMemoryServer;

export async function setupTestDB(): Promise<void> {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
}

export async function teardownTestDB(): Promise<void> {
  await disconnectDB();
  await mongoServer.stop();
}

export async function clearDB(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].drop().catch(() => {});
  }
}
```

### Test Fixtures

```typescript
const validUser = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  fullName: 'Test User',
  role: 'recruiter',
};

const validGuest = {
  fullName: 'Guest User',
  fingerprint: 'test-fingerprint-abc123',
};

const validMeeting = () => ({
  title: 'Interview Meeting',
  candidateName: 'Alice Smith',
  position: 'Software Engineer',
  startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  meetingType: 'online',
  platform: 'Zoom',
});

const validFeedback = {
  topic: 'Technical Skills',
  comment: 'Great candidate with excellent technical skills',
  rating: 5,
};
```

### Admin User Helper

Admin users cannot be created via the registration endpoint (only `recruiter` and `interviewer` are allowed). Tests that require an admin user create one directly in the database and sign a JWT manually:

```typescript
async function createAdminAndLogin() {
  const hashedPassword = await bcrypt.hash('SecurePass123!', 10);
  const user = await User.create({
    email: `admin-${userCounter}@test.local`,
    password: hashedPassword,
    fullName: 'Test admin',
    role: 'admin',
    userType: 'user',
  });
  const accessToken = jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
  return { accessToken, userId: user._id.toString() };
}
```

---

## Authentication Tests

### Test Suite: POST /api/v1/auth/register

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 1.1 | Successful user registration | 201 | Integration |
| 1.2 | Duplicate email registration | 400 VALIDATION_ERROR | Integration |
| 1.3 | Invalid email format | 400 details[].field=email | Integration |
| 1.4 | Weak password | 400 details[].field=password | Integration |

#### 1.1: Successful user registration

```typescript
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
```

#### 1.2: Duplicate email registration

```typescript
it('should return 400 for duplicate email', async () => {
  await request(app).post('/api/v1/auth/register').send(validUser);
  const res = await request(app).post('/api/v1/auth/register').send(validUser).expect(400);

  expect(res.body.success).toBe(false);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
});
```

#### 1.3: Invalid email format

```typescript
it('should return 400 for invalid email format', async () => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ ...validUser, email: 'invalid-email' })
    .expect(400);

  expect(res.body.success).toBe(false);
  expect(res.body.error.details[0].field).toBe('email');
});
```

#### 1.4: Weak password

```typescript
it('should return 400 for weak password', async () => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ ...validUser, password: 'weak' })
    .expect(400);

  expect(res.body.error.details[0].field).toBe('password');
});
```

---

### Test Suite: POST /api/v1/auth/login

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 2.1 | Successful login | 200 | Integration |
| 2.2 | Wrong password | 401 UNAUTHORIZED | Integration |
| 2.3 | Non-existent user | 401 UNAUTHORIZED | Integration |

#### 2.1: Successful login

```typescript
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
```

#### 2.2: Wrong password

```typescript
it('should return 401 for wrong password', async () => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: validUser.email, password: 'WrongPassword123!' })
    .expect(401);

  expect(res.body.success).toBe(false);
  expect(res.body.error.code).toBe('UNAUTHORIZED');
});
```

#### 2.3: Non-existent user

```typescript
it('should return 401 for non-existent user', async () => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'nonexistent@example.com', password: 'SecurePass123!' })
    .expect(401);

  expect(res.body.error.code).toBe('UNAUTHORIZED');
});
```

---

### Test Suite: POST /api/v1/auth/refresh

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 3.1 | Successful token refresh | 200 | Integration + Unit |
| 3.2 | Invalid refresh token | 401 | Integration + Unit |

#### 3.1: Successful token refresh

```typescript
it('should refresh access token successfully', async () => {
  const loginRes = await request(app).post('/api/v1/auth/register').send(validUser);
  const { refreshToken } = loginRes.body.data;

  const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken }).expect(200);

  expect(res.body.success).toBe(true);
  expect(res.body.data.accessToken).toBeDefined();
});
```

#### 3.2: Invalid refresh token

```typescript
it('should return 401 for invalid refresh token', async () => {
  const res = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken: 'invalid-token' })
    .expect(401);

  expect(res.body.success).toBe(false);
});
```

---

### Test Suite: POST /api/v1/auth/register/guest

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 4.1 | Successful guest registration | 201 | Integration + Unit |
| 4.2 | Duplicate fingerprint | 400 VALIDATION_ERROR | Integration + Unit |
| 4.3 | Missing fullName | 400 details[].field=fullName | Integration |
| 4.4 | Missing fingerprint | 400 details[].field=fingerprint | Integration |
| 4.5 | fullName too short | 400 details[].field=fullName | Integration |
| 4.6 | Guest created without password | password=null | Unit |

#### 4.1: Successful guest registration

```typescript
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
```

#### 4.2: Duplicate fingerprint

```typescript
it('should return 400 for duplicate fingerprint', async () => {
  await request(app).post('/api/v1/auth/register/guest').send(validGuest);
  const res = await request(app).post('/api/v1/auth/register/guest').send(validGuest).expect(400);

  expect(res.body.success).toBe(false);
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
  expect(res.body.error.details[0].field).toBe('fingerprint');
});
```

---

### Test Suite: POST /api/v1/auth/login/guest

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 5.1 | Successful guest login | 200 | Integration + Unit |
| 5.2 | Unknown fingerprint | 401 UNAUTHORIZED | Integration + Unit |
| 5.3 | Missing fingerprint | 400 details[].field=fingerprint | Integration |
| 5.4 | New tokens on each login | tokens differ | Integration |
| 5.5 | Guest refresh token usable | 200 | Integration |
| 5.6 | Refresh tokens capped at 5 | length <= 5 | Unit |

#### 5.1: Successful guest login

```typescript
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
```

#### 5.6: Refresh tokens capped at 5 (Unit)

```typescript
it('should cap refresh tokens at 5', async () => {
  for (let i = 0; i < 6; i++) {
    await loginGuest({ fingerprint: validGuest.fingerprint });
  }
  const user = await User.findOne({ userType: 'guest' });
  expect(user?.refreshTokens.length).toBeLessThanOrEqual(5);
});
```

---

### Test Suite: POST /api/v1/auth/login (guest rejection)

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 6.1 | Guest can't use regular login (null email) | 401 | Integration |
| 6.2 | Guest must use /login/guest endpoint | 200 | Integration |

#### 6.1: Guest can't use regular login

```typescript
it('should return 401 when guest tries to login via regular login (guest has no email/password)', async () => {
  const guestRes = await request(app)
    .post('/api/v1/auth/register/guest')
    .send({ fullName: 'Guest', fingerprint: 'reject-fingerprint-001' });

  expect(guestRes.body.data.user.email).toBeNull();

  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'anything@example.com', password: 'SecurePass123!' })
    .expect(401);

  expect(res.body.success).toBe(false);
  expect(res.body.error.code).toBe('UNAUTHORIZED');
});
```

---

### Test Suite: POST /api/v1/auth/logout

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 7.1 | Successful logout | 200 | Integration + Unit |
| 7.2 | Refresh token invalidated after logout | 401 on refresh | Integration + Unit |
| 7.3 | 401 without auth token | 401 | Integration |

#### 7.2: Refresh token invalidated after logout

```typescript
it('should invalidate refresh token after logout', async () => {
  const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
  const { accessToken, refreshToken } = registerRes.body.data;

  await request(app)
    .post('/api/v1/auth/logout')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ refreshToken })
    .expect(200);

  const res = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken })
    .expect(401);

  expect(res.body.success).toBe(false);
});
```

---

### Test Suite: GET /api/v1/auth/me

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| 8.1 | Return authenticated user info | 200 | Integration + Unit |
| 8.2 | Return guest user info | 200 | Integration + Unit |
| 8.3 | 401 without authentication | 401 | Integration |
| 8.4 | 401 with invalid token | 401 | Integration |
| 8.5 | UnauthorizedError for non-existent userId | throws | Unit |

#### 8.1: Return authenticated user info

```typescript
it('should return current user info for authenticated user', async () => {
  const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
  const { accessToken } = registerRes.body.data;

  const res = await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  expect(res.body.success).toBe(true);
  expect(res.body.data.user.email).toBe(validUser.email);
  expect(res.body.data.user.fullName).toBe(validUser.fullName);
  expect(res.body.data.user.role).toBe(validUser.role);
  expect(res.body.data.user.userType).toBe('user');
});
```

#### 8.2: Return guest user info

```typescript
it('should return guest user info', async () => {
  const guestRes = await request(app)
    .post('/api/v1/auth/register/guest')
    .send({ fullName: 'Guest User', fingerprint: 'me-endpoint-fingerprint' });
  const { accessToken } = guestRes.body.data;

  const res = await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  expect(res.body.success).toBe(true);
  expect(res.body.data.user.email).toBeNull();
  expect(res.body.data.user.fullName).toBe('Guest User');
  expect(res.body.data.user.userType).toBe('guest');
});
```

---

## Auth Unit Tests (Service Layer)

### register service

| # | Test Case | Method |
|---|-----------|--------|
| U1.1 | Create user and return tokens | Unit |
| U1.2 | Hash the password (bcrypt) | Unit |
| U1.3 | Throw ValidationError for duplicate email | Unit |

### login service

| # | Test Case | Method |
|---|-----------|--------|
| U2.1 | Return tokens for valid credentials | Unit |
| U2.2 | Throw UnauthorizedError for wrong password | Unit |
| U2.3 | Throw UnauthorizedError for non-existent user | Unit |

### getMe service

| # | Test Case | Method |
|---|-----------|--------|
| U3.1 | Return user info for valid userId | Unit |
| U3.2 | Return guest user info | Unit |
| U3.3 | Throw UnauthorizedError for non-existent userId | Unit |

---

## Meeting Tests

### Test Suite: POST /api/v1/meetings

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| M1.1 | Create meeting for authenticated user | 201 | Integration + Unit |
| M1.2 | 401 without authentication | 401 | Integration |
| M1.3 | 400 for missing required fields (title, candidateName, etc.) | 400 | Integration |
| M1.4 | 400 when endTime is before startTime | 400 details[].field=endTime | Integration |
| M1.5 | 400 when startTime is in the past | 400 details[].field=startTime | Integration |
| M1.6 | 400 for online meeting without platform | 400 details[].field=platform | Integration |
| M1.7 | Allow onsite meeting without platform | 201 | Integration |
| M1.8 | Always set status to pending on create | status=pending | Integration + Unit |
| M1.9 | Store startTime and endTime as Dates | instanceof Date | Unit |

#### M1.1: Create meeting

```typescript
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
```

---

### Test Suite: GET /api/v1/meetings

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| M2.1 | Return paginated list of meetings | 200 | Integration + Unit |
| M2.2 | Paginate with page and limit params | hasNext/hasPrev | Integration + Unit |
| M2.3 | Filter by status | filtered results | Integration + Unit |
| M2.4 | 401 without authentication | 401 | Integration |
| M2.5 | 400 for invalid query params (page=abc) | 400 | Integration |
| M2.6 | 400 for invalid status filter | 400 | Integration |
| M2.7 | Default page=1 and limit=10 | pagination defaults | Unit |

#### Response format

```typescript
// GET /api/v1/meetings?page=1&limit=2
{
  success: true,
  data: [...],           // array of meetings
  pagination: {
    total: 3,
    page: 1,
    limit: 2,
    totalPages: 2,
    hasNext: true,
    hasPrev: false,
  }
}
```

---

### Test Suite: GET /api/v1/meetings/:id

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| M3.1 | Return meeting by id (with populated createdBy) | 200 | Integration + Unit |
| M3.2 | 404 for non-existent meeting | 404 MEETING_NOT_FOUND | Integration + Unit |
| M3.3 | 401 without authentication | 401 | Integration |
| M3.4 | Throw for invalid id format | throws | Unit |

---

### Test Suite: PUT /api/v1/meetings/:id

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| M4.1 | Update meeting for owner | 200 | Integration + Unit |
| M4.2 | Allow admin to update any meeting (admin created via DB) | 200 | Integration + Unit |
| M4.3 | 403 when non-owner tries to update | 403 FORBIDDEN | Integration + Unit |
| M4.4 | 404 for non-existent meeting | 404 MEETING_NOT_FOUND | Integration + Unit |
| M4.5 | 401 without authentication | 401 | Integration |
| M4.6 | Update startTime/endTime as Dates | instanceof Date | Unit |

---

### Test Suite: DELETE /api/v1/meetings/:id

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| M5.1 | Delete meeting for owner | 200 | Integration + Unit |
| M5.2 | Allow admin to delete any meeting (admin created via DB) | 200 | Integration + Unit |
| M5.3 | 403 when non-owner tries to delete | 403 FORBIDDEN | Integration + Unit |
| M5.4 | 404 for non-existent meeting | 404 MEETING_NOT_FOUND | Integration + Unit |
| M5.5 | 401 without authentication | 401 | Integration |

#### M5.1: Delete meeting

```typescript
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
```

---

### Test Suite: POST /api/v1/meetings/:id/feedback

| # | Test Case | Status | Method |
|---|-----------|--------|--------|
| F1.1 | Allow interviewer to add feedback | 201 | Integration + Unit |
| F1.2 | Allow admin to add feedback | 201 | Unit |
| F1.3 | Allow recruiter to add feedback | 201 | Integration + Unit |
| F1.4 | 400 for invalid rating (out of range 1-5) | 400 details[].field=rating | Integration |
| F1.5 | 400 for missing topic | 400 details[].field=topic | Integration |
| F1.6 | 404 for non-existent meeting | 404 MEETING_NOT_FOUND | Integration + Unit |
| F1.7 | 401 without authentication | 401 | Integration |
| F1.8 | Accumulate multiple feedback entries | feedback.length=2 | Unit |

#### Feedback input format

```typescript
// topic is required, comment is optional
const feedback = {
  topic: 'Technical Skills',        // required, min 1 char, max 200
  comment: 'Excellent candidate',   // optional, max 2000
  rating: 5,                        // required, integer 1-5
};
```

#### F1.1: Interviewer adds feedback

```typescript
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
```

---

## Test Coverage Summary

### Test Files

| File | Type | Tests |
|------|------|-------|
| `tests/unit/auth.service.test.ts` | Unit | 14 |
| `tests/unit/meeting.service.test.ts` | Unit | 21 |
| `tests/integration/auth.test.ts` | Integration | 27 |
| `tests/integration/meeting.test.ts` | Integration | 33 |
| **Total** | | **95 → 105** |

### Coverage Target

- **Unit Tests**: > 80% — All services and utilities
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user journeys (planned)

### Running Tests

```bash
# From project root
pnpm test                  # All tests
pnpm test:api              # Backend only
pnpm test:api:unit         # Unit tests only
pnpm test:api:integration  # Integration tests only

# From apps/backend
pnpm test                  # All backend tests
pnpm test:unit             # Unit tests only
pnpm test:integration      # Integration tests only
```

---

**Document Version**: 2.1
**Last Updated**: March 10, 2026
