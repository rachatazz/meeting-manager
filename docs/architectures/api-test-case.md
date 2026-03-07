# API Test Cases

## Authentication Tests

### Test Suite: POST /auth/register

#### Test Case 1.1: Successful user registration

```typescript
describe('POST /auth/register', () => {
  it('should register a new user successfully', async () => {
    const payload = {
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      fullName: 'New User',
      role: 'recruiter',
    };

    const response = await request(app).post('/api/v1/auth/register').send(payload).expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.user.fullName).toBe(payload.fullName);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    expect(response.body.data.user.password).toBeUndefined();
  });
});
```

#### Test Case 1.2: Duplicate email registration

```typescript
it('should return 400 for duplicate email', async () => {
  const payload = {
    email: 'existing@example.com',
    password: 'SecurePass123!',
    fullName: 'Duplicate User',
    role: 'recruiter',
  };

  await request(app).post('/api/v1/auth/register').send(payload);

  const response = await request(app).post('/api/v1/auth/register').send(payload).expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});
```

#### Test Case 1.3: Invalid email format

```typescript
it('should return 400 for invalid email', async () => {
  const payload = {
    email: 'invalid-email',
    password: 'SecurePass123!',
    fullName: 'Test User',
    role: 'recruiter',
  };

  const response = await request(app).post('/api/v1/auth/register').send(payload).expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.details[0].field).toBe('email');
});
```

#### Test Case 1.4: Weak password

```typescript
it('should return 400 for weak password', async () => {
  const payload = {
    email: 'user@example.com',
    password: 'weak',
    fullName: 'Test User',
    role: 'recruiter',
  };

  const response = await request(app).post('/api/v1/auth/register').send(payload).expect(400);

  expect(response.body.error.details[0].field).toBe('password');
});
```

---

### Test Suite: POST /auth/login

#### Test Case 2.1: Successful login

```typescript
describe('POST /auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const payload = {
      email: 'user@example.com',
      password: 'SecurePass123!',
    };

    const response = await request(app).post('/api/v1/auth/login').send(payload).expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });
});
```

#### Test Case 2.2: Invalid credentials

```typescript
it('should return 401 for invalid password', async () => {
  const payload = {
    email: 'user@example.com',
    password: 'WrongPassword123!',
  };

  const response = await request(app).post('/api/v1/auth/login').send(payload).expect(401);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
});
```

#### Test Case 2.3: Non-existent user

```typescript
it('should return 401 for non-existent user', async () => {
  const payload = {
    email: 'nonexistent@example.com',
    password: 'SecurePass123!',
  };

  const response = await request(app).post('/api/v1/auth/login').send(payload).expect(401);

  expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
});
```

---

### Test Suite: POST /auth/refresh

#### Test Case 3.1: Successful token refresh

```typescript
describe('POST /auth/refresh', () => {
  it('should refresh access token successfully', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'SecurePass123!' });

    const refreshToken = loginResponse.body.data.refreshToken;

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

#### Test Case 3.2: Invalid refresh token

```typescript
it('should return 401 for invalid refresh token', async () => {
  const response = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken: 'invalid-token' })
    .expect(401);

  expect(response.body.success).toBe(false);
});
```

---

### Test Suite: POST /auth/register/guest

#### Test Case 1.5: Successful guest registration

```typescript
describe('POST /auth/register/guest', () => {
  it('should register a new guest successfully', async () => {
    const payload = {
      fullName: 'Guest User',
      fingerprint: 'test-fingerprint-abc123',
    };

    const response = await request(app)
      .post('/api/v1/auth/register/guest')
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.fullName).toBe(payload.fullName);
    expect(response.body.data.user.email).toBeNull();
    expect(response.body.data.user.role).toBe('recruiter');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.user.fingerprint).toBeUndefined();
  });
});
```

#### Test Case 1.6: Duplicate fingerprint

```typescript
it('should return 400 for duplicate fingerprint', async () => {
  const payload = {
    fullName: 'Guest User',
    fingerprint: 'duplicate-fingerprint',
  };

  await request(app).post('/api/v1/auth/register/guest').send(payload);

  const response = await request(app).post('/api/v1/auth/register/guest').send(payload).expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details[0].field).toBe('fingerprint');
});
```

#### Test Case 1.7: Missing fullName

```typescript
it('should return 400 for missing fullName', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register/guest')
    .send({ fingerprint: 'some-fingerprint' })
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.details[0].field).toBe('fullName');
});
```

#### Test Case 1.8: Missing fingerprint

```typescript
it('should return 400 for missing fingerprint', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register/guest')
    .send({ fullName: 'Guest User' })
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.details[0].field).toBe('fingerprint');
});
```

#### Test Case 1.9: fullName too short

```typescript
it('should return 400 for fullName too short', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register/guest')
    .send({ fullName: 'A', fingerprint: 'some-fingerprint' })
    .expect(400);

  expect(response.body.error.details[0].field).toBe('fullName');
});
```

---

### Test Suite: POST /auth/login/guest

#### Test Case 2.4: Successful guest login

```typescript
describe('POST /auth/login/guest', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fullName: 'Guest User', fingerprint: 'login-fingerprint-xyz789' });
  });

  it('should login guest successfully with valid fingerprint', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login/guest')
      .send({ fingerprint: 'login-fingerprint-xyz789' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.fullName).toBe('Guest User');
    expect(response.body.data.user.email).toBeNull();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    expect(response.body.data.user.fingerprint).toBeUndefined();
  });
});
```

#### Test Case 2.5: Unknown fingerprint

```typescript
it('should return 401 for unknown fingerprint', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login/guest')
    .send({ fingerprint: 'non-existent-fingerprint' })
    .expect(401);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('UNAUTHORIZED');
});
```

#### Test Case 2.6: Missing fingerprint

```typescript
it('should return 400 for missing fingerprint', async () => {
  const response = await request(app).post('/api/v1/auth/login/guest').send({}).expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.details[0].field).toBe('fingerprint');
});
```

#### Test Case 2.7: Guest login issues new tokens each time

```typescript
it('should issue new tokens on each guest login', async () => {
  const first = await request(app)
    .post('/api/v1/auth/login/guest')
    .send({ fingerprint: 'login-fingerprint-xyz789' });

  await new Promise((r) => setTimeout(r, 1100));

  const second = await request(app)
    .post('/api/v1/auth/login/guest')
    .send({ fingerprint: 'login-fingerprint-xyz789' });

  expect(first.body.data.accessToken).not.toBe(second.body.data.accessToken);
  expect(first.body.data.refreshToken).not.toBe(second.body.data.refreshToken);
});
```

#### Test Case 2.8: Guest refresh token is usable

```typescript
it('new guest refresh token should be usable', async () => {
  const loginRes = await request(app)
    .post('/api/v1/auth/login/guest')
    .send({ fingerprint: 'login-fingerprint-xyz789' });

  const { refreshToken } = loginRes.body.data;

  const response = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken })
    .expect(200);

  expect(response.body.data.accessToken).toBeDefined();
});
```

---

### Test Suite: POST /auth/login (guest rejection)

#### Test Case 2.9: Guest account rejected at regular login

```typescript
describe('POST /auth/login (guest rejection)', () => {
  it('should return 401 when guest account tries to login via regular login', async () => {
    await request(app)
      .post('/api/v1/auth/register/guest')
      .send({ fullName: 'Guest', fingerprint: 'reject-fingerprint-001' });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'anything@example.com', password: 'SecurePass123!' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

---

## Meeting Tests

### Test Suite: GET /meetings

#### Test Case 4.1: Get meetings with pagination

```typescript
describe('GET /meetings', () => {
  it('should return paginated meetings', async () => {
    const response = await request(app)
      .get('/api/v1/meetings?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.meetings).toBeInstanceOf(Array);
    expect(response.body.data.pagination.currentPage).toBe(1);
    expect(response.body.data.pagination.itemsPerPage).toBe(10);
  });
});
```

#### Test Case 4.2: Filter by status

```typescript
it('should filter meetings by status', async () => {
  const response = await request(app)
    .get('/api/v1/meetings?status=confirmed')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  expect(response.body.data.meetings.every((m) => m.status === 'confirmed')).toBe(true);
});
```

#### Test Case 4.3: Search by candidate name

```typescript
it('should search meetings by candidate name', async () => {
  const response = await request(app)
    .get('/api/v1/meetings?search=Alice')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  expect(response.body.data.meetings.length).toBeGreaterThan(0);
  expect(response.body.data.meetings[0].candidateName).toContain('Alice');
});
```

#### Test Case 4.4: Unauthorized access

```typescript
it('should return 401 without authentication', async () => {
  const response = await request(app).get('/api/v1/meetings').expect(401);

  expect(response.body.error.code).toBe('UNAUTHORIZED');
});
```

---

### Test Suite: POST /meetings

#### Test Case 5.1: Create meeting successfully

```typescript
describe('POST /meetings', () => {
  it('should create a new meeting', async () => {
    const payload = {
      candidateName: 'Bob Smith',
      position: 'Backend Developer',
      startTime: '2026-04-01T10:00:00Z',
      endTime: '2026-04-01T11:00:00Z',
      meetingType: 'online',
      platform: 'zoom',
      notes: 'Technical interview',
    };

    const response = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.candidateName).toBe(payload.candidateName);
    expect(response.body.data.status).toBe('pending');
  });
});
```

#### Test Case 5.2: Invalid time range

```typescript
it('should return 400 for end time before start time', async () => {
  const payload = {
    candidateName: 'Bob Smith',
    position: 'Backend Developer',
    startTime: '2026-04-01T11:00:00Z',
    endTime: '2026-04-01T10:00:00Z',
    meetingType: 'online',
    platform: 'zoom',
  };

  const response = await request(app)
    .post('/api/v1/meetings')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload)
    .expect(400);

  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});
```

#### Test Case 5.3: Past date validation

```typescript
it('should return 400 for past start time', async () => {
  const payload = {
    candidateName: 'Bob Smith',
    position: 'Backend Developer',
    startTime: '2020-01-01T10:00:00Z',
    endTime: '2020-01-01T11:00:00Z',
    meetingType: 'online',
    platform: 'zoom',
  };

  const response = await request(app)
    .post('/api/v1/meetings')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload)
    .expect(400);
});
```

#### Test Case 5.4: Missing required fields

```typescript
it('should return 400 for missing required fields', async () => {
  const payload = {
    candidateName: 'Bob Smith',
  };

  const response = await request(app)
    .post('/api/v1/meetings')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload)
    .expect(400);

  expect(response.body.error.details.length).toBeGreaterThan(0);
});
```

---

### Test Suite: PUT /meetings/:id

#### Test Case 6.1: Update meeting successfully

```typescript
describe('PUT /meetings/:id', () => {
  it('should update meeting details', async () => {
    const meetingId = '507f1f77bcf86cd799439011';
    const payload = {
      status: 'confirmed',
      notes: 'Updated notes',
    };

    const response = await request(app)
      .put(`/api/v1/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload)
      .expect(200);

    expect(response.body.data.status).toBe('confirmed');
    expect(response.body.data.notes).toBe('Updated notes');
  });
});
```

#### Test Case 6.2: Update non-existent meeting

```typescript
it('should return 404 for non-existent meeting', async () => {
  const response = await request(app)
    .put('/api/v1/meetings/507f1f77bcf86cd799439999')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ status: 'confirmed' })
    .expect(404);

  expect(response.body.error.code).toBe('MEETING_NOT_FOUND');
});
```

#### Test Case 6.3: Unauthorized update

```typescript
it("should return 403 when updating another user's meeting", async () => {
  const meetingId = '507f1f77bcf86cd799439011';

  const response = await request(app)
    .put(`/api/v1/meetings/${meetingId}`)
    .set('Authorization', `Bearer ${otherUserToken}`)
    .send({ status: 'confirmed' })
    .expect(403);

  expect(response.body.error.code).toBe('FORBIDDEN');
});
```

---

### Test Suite: DELETE /meetings/:id

#### Test Case 7.1: Delete meeting successfully

```typescript
describe('DELETE /meetings/:id', () => {
  it('should delete meeting', async () => {
    const meetingId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .delete(`/api/v1/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);

    await request(app)
      .get(`/api/v1/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
```

#### Test Case 7.2: Delete non-existent meeting

```typescript
it('should return 404 for non-existent meeting', async () => {
  const response = await request(app)
    .delete('/api/v1/meetings/507f1f77bcf86cd799439999')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(404);
});
```

---

### Test Suite: POST /meetings/:id/feedback

#### Test Case 8.1: Add feedback successfully

```typescript
describe('POST /meetings/:id/feedback', () => {
  it('should add feedback to meeting', async () => {
    const meetingId = '507f1f77bcf86cd799439011';
    const payload = {
      comment: 'Excellent technical skills and communication',
      rating: 5,
    };

    const response = await request(app)
      .post(`/api/v1/meetings/${meetingId}/feedback`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload)
      .expect(201);

    expect(response.body.data.comment).toBe(payload.comment);
    expect(response.body.data.rating).toBe(payload.rating);
  });
});
```

#### Test Case 8.2: Invalid rating

```typescript
it('should return 400 for invalid rating', async () => {
  const meetingId = '507f1f77bcf86cd799439011';
  const payload = {
    comment: 'Good candidate',
    rating: 6,
  };

  const response = await request(app)
    .post(`/api/v1/meetings/${meetingId}/feedback`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload)
    .expect(400);
});
```

---

## Integration Tests

### Test Case 9.1: Complete user flow

```typescript
describe('Integration: Complete Meeting Flow', () => {
  it('should complete full meeting lifecycle', async () => {
    let accessToken, meetingId;

    const registerRes = await request(app).post('/api/v1/auth/register').send({
      email: 'integration@example.com',
      password: 'SecurePass123!',
      fullName: 'Integration Test',
      role: 'recruiter',
    });

    accessToken = registerRes.body.data.accessToken;

    const createRes = await request(app)
      .post('/api/v1/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        candidateName: 'Test Candidate',
        position: 'Software Engineer',
        startTime: '2026-05-01T10:00:00Z',
        endTime: '2026-05-01T11:00:00Z',
        meetingType: 'online',
        platform: 'zoom',
      });

    meetingId = createRes.body.data.id;
    expect(createRes.status).toBe(201);

    const updateRes = await request(app)
      .put(`/api/v1/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'confirmed' });

    expect(updateRes.body.data.status).toBe('confirmed');

    const feedbackRes = await request(app)
      .post(`/api/v1/meetings/${meetingId}/feedback`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        comment: 'Great interview',
        rating: 5,
      });

    expect(feedbackRes.status).toBe(201);

    const deleteRes = await request(app)
      .delete(`/api/v1/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(200);
  });
});
```

---

## E2E Test Scenarios

### Scenario 1: Recruiter schedules and manages interviews

```typescript
describe('E2E: Recruiter Interview Management', () => {
  it('should allow recruiter to manage complete interview process', async () => {
    // 1. Login as recruiter
    // 2. Create multiple meetings
    // 3. View dashboard with filters
    // 4. Update meeting status
    // 5. Add feedback
    // 6. Search for specific candidate
    // 7. Delete cancelled meeting
  });
});
```

### Scenario 2: Multiple users concurrent access

```typescript
describe('E2E: Concurrent User Access', () => {
  it('should handle multiple users accessing same meeting', async () => {
    // 1. Create meeting as recruiter
    // 2. Login as interviewer
    // 3. Both users view same meeting
    // 4. Interviewer adds feedback
    // 5. Recruiter updates status
    // 6. Verify both see updated data
  });
});
```

---

## Test Coverage Requirements

### Unit Tests

- **Target**: > 80% code coverage
- **Scope**: All services, utilities, validators
- **Mock**: External dependencies (database, external APIs)

### Integration Tests

- **Target**: All API endpoints
- **Scope**: Request/response validation, database operations
- **Environment**: Test database with fixtures

### E2E Tests

- **Target**: Critical user journeys
- **Scope**: Complete workflows from login to logout
- **Environment**: Isolated test environment

---

## Test Setup

### Prerequisites

```typescript
import request from 'supertest';
import { app } from '../src/app';
import { connectDB, disconnectDB } from '../src/config/database';
import { User } from '../src/models/User';
import { Meeting } from '../src/models/Meeting';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Meeting.deleteMany({});
});
```

### Test Fixtures

```typescript
export const testUsers = {
  recruiter: {
    email: 'recruiter@example.com',
    password: 'SecurePass123!',
    fullName: 'Test Recruiter',
    role: 'recruiter',
  },
  interviewer: {
    email: 'interviewer@example.com',
    password: 'SecurePass123!',
    fullName: 'Test Interviewer',
    role: 'interviewer',
  },
  guest: {
    fullName: 'Test Guest',
    fingerprint: 'test-guest-fingerprint-fixture',
  },
};

export const testMeetings = {
  upcoming: {
    candidateName: 'Alice Johnson',
    position: 'Software Engineer',
    startTime: new Date(Date.now() + 86400000),
    endTime: new Date(Date.now() + 90000000),
    meetingType: 'online',
    platform: 'zoom',
  },
};
```

---

**Document Version**: 1.1  
**Last Updated**: March 7, 2026
