# API Specification

## Base URL

```
Development: http://localhost:3001/api/v1
Production: https://api.meeting-manager.com/api/v1
```

---

## Authentication Endpoints

### POST /auth/register

**Description**: Register a new user

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "recruiter"
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "recruiter"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation**:

- Email: valid email format, unique
- Password: min 8 chars, 1 uppercase, 1 number, 1 special char
- Full name: 2-100 characters
- Role: enum [recruiter, interviewer, admin]

---

### POST /auth/register/guest

**Description**: Register a new guest user. The frontend generates a browser fingerprint (e.g., using FingerprintJS or a UUID stored in localStorage/IndexedDB) and sends it along with a display name. No email or password is required.

**Request Body**:

```json
{
  "fullName": "Guest User",
  "fingerprint": "a1b2c3d4e5f6..."
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": null,
      "fullName": "Guest User",
      "role": "recruiter"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation**:

- Full name: 2-100 characters, required
- Fingerprint: non-empty string, required

**Notes**:

- No email or password is stored on the server for guest accounts
- The frontend generates a unique browser fingerprint and persists it locally (e.g., localStorage/IndexedDB); this fingerprint is the guest's sole identity credential
- The fingerprint is used as the unique key on the server (sparse unique index); duplicate fingerprints are rejected
- Guests use the returned `accessToken`/`refreshToken` to call the API; the locally-stored fingerprint allows the frontend to re-register on a new session if all tokens are lost
- Guest accounts have `userType: "guest"`, `email: null`, and cannot use `POST /auth/login`

---

### POST /auth/login

**Description**: Authenticate user

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "recruiter"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### POST /auth/login/guest

**Description**: Authenticate an existing guest user using their browser fingerprint. Returns fresh access and refresh tokens.

**Request Body**:

```json
{
  "fingerprint": "a1b2c3d4e5f6..."
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": null,
      "fullName": "Guest User",
      "role": "recruiter"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid fingerprint"
  }
}
```

**Validation**:

- Fingerprint: non-empty string, required

**Notes**:

- Used when the guest's tokens have expired or been cleared but the fingerprint is still available in localStorage/IndexedDB
- If the fingerprint is also lost (e.g., cleared browser data), the guest must call `POST /auth/register/guest` with the same or a new fingerprint

---

### POST /auth/refresh

**Description**: Refresh access token

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/logout

**Description**: Logout user (invalidate refresh token)

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Meeting Endpoints

### GET /meetings

**Description**: Get paginated list of meetings

**Query Parameters**:

- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `status` (string, optional): pending|confirmed|cancelled
- `search` (string, optional): search by candidate name or position (text index)
- `sortBy` (string, default: createdAt): startTime|createdAt|candidateName
- `sortOrder` (string, default: desc): asc|desc
- `startDate` (string, optional): ISO 8601 datetime, filter meetings from this date
- `endDate` (string, optional): ISO 8601 datetime, filter meetings until this date

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Technical Interview - Software Engineer",
      "description": "First-round technical interview",
      "candidateName": "Alice Johnson",
      "position": "Software Engineer",
      "startTime": "2026-03-15T10:00:00Z",
      "endTime": "2026-03-15T11:00:00Z",
      "meetingType": "online",
      "platform": "zoom",
      "status": "confirmed",
      "notes": "Technical interview - focus on algorithms",
      "interviewNotes": "Strong candidate",
      "createdBy": {
        "id": "507f1f77bcf86cd799439012",
        "fullName": "John Doe"
      },
      "createdAt": "2026-03-07T08:30:00Z",
      "updatedAt": "2026-03-07T08:30:00Z"
    }
  ],
  "pagination": {
    "total": 95,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /meetings/summary

**Description**: Get today's meetings and status summary

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "todayMeetings": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Technical Interview",
        "candidateName": "Alice Johnson",
        "position": "Software Engineer",
        "startTime": "2026-03-08T10:00:00Z",
        "endTime": "2026-03-08T11:00:00Z",
        "meetingType": "online",
        "status": "confirmed",
        "createdBy": {
          "id": "507f1f77bcf86cd799439012",
          "fullName": "John Doe"
        }
      }
    ],
    "summary": {
      "total": 3,
      "byStatus": {
        "pending": 1,
        "confirmed": 1,
        "cancelled": 1
      }
    }
  }
}
```

---

### GET /meetings/:id

**Description**: Get meeting details by ID

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Technical Interview - Software Engineer",
    "description": "First-round technical interview",
    "candidateName": "Alice Johnson",
    "position": "Software Engineer",
    "startTime": "2026-03-15T10:00:00Z",
    "endTime": "2026-03-15T11:00:00Z",
    "meetingType": "online",
    "platform": "zoom",
    "meetingLink": "https://zoom.us/j/123456789",
    "status": "confirmed",
    "notes": "Technical interview - focus on algorithms",
    "interviewNotes": "Strong candidate with good technical depth",
    "feedback": [
      {
        "id": "507f1f77bcf86cd799439013",
        "interviewer": {
          "id": "507f1f77bcf86cd799439014",
          "fullName": "Jane Smith"
        },
        "topic": "Problem Solving",
        "comment": "Strong problem-solving skills",
        "rating": 4,
        "createdAt": "2026-03-15T11:05:00Z"
      }
    ],
    "createdBy": {
      "id": "507f1f77bcf86cd799439012",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-03-07T08:30:00Z",
    "updatedAt": "2026-03-07T08:30:00Z"
  }
}
```

**Error Response** (404):

```json
{
  "success": false,
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "Meeting not found"
  }
}
```

---

### POST /meetings

**Description**: Create a new meeting

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body**:

```json
{
  "title": "Technical Interview - Software Engineer",
  "description": "First-round technical interview",
  "candidateName": "Alice Johnson",
  "position": "Software Engineer",
  "startTime": "2026-03-15T10:00:00Z",
  "endTime": "2026-03-15T11:00:00Z",
  "meetingType": "online",
  "platform": "zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "notes": "Technical interview - focus on algorithms"
}
```

**Validation**:

- title: 2-200 characters, required
- description: max 2000 characters, optional
- candidateName: 2-100 characters, required
- position: 2-100 characters, required
- startTime: ISO 8601 datetime, future date, required
- endTime: ISO 8601 datetime, after startTime, required
- meetingType: enum [online, onsite], required
- platform: string, required if meetingType is online
- meetingLink: valid URL, optional
- notes: max 2000 characters, optional
- interviewNotes: max 5000 characters, optional

**Response** (201):

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Technical Interview - Software Engineer",
    "description": "First-round technical interview",
    "candidateName": "Alice Johnson",
    "position": "Software Engineer",
    "startTime": "2026-03-15T10:00:00Z",
    "endTime": "2026-03-15T11:00:00Z",
    "meetingType": "online",
    "platform": "zoom",
    "meetingLink": "https://zoom.us/j/123456789",
    "status": "pending",
    "notes": "Technical interview - focus on algorithms",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2026-03-07T08:30:00Z",
    "updatedAt": "2026-03-07T08:30:00Z"
  }
}
```

**Error Response** (400):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "startTime",
        "message": "Start time must be in the future"
      }
    ]
  }
}
```

---

### PUT /meetings/:id

**Description**: Update meeting details

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body** (all fields optional):

```json
{
  "title": "Updated Interview Title",
  "description": "Updated description",
  "candidateName": "Alice Johnson",
  "position": "Senior Software Engineer",
  "startTime": "2026-03-15T14:00:00Z",
  "endTime": "2026-03-15T15:00:00Z",
  "meetingType": "onsite",
  "platform": null,
  "meetingLink": null,
  "status": "confirmed",
  "notes": "Updated: Technical + behavioral interview",
  "interviewNotes": "Updated notes after interview"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Interview Title",
    "description": "Updated description",
    "candidateName": "Alice Johnson",
    "position": "Senior Software Engineer",
    "startTime": "2026-03-15T14:00:00Z",
    "endTime": "2026-03-15T15:00:00Z",
    "meetingType": "onsite",
    "platform": null,
    "meetingLink": null,
    "status": "confirmed",
    "notes": "Updated: Technical + behavioral interview",
    "interviewNotes": "Updated notes after interview",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2026-03-07T08:30:00Z",
    "updatedAt": "2026-03-07T09:15:00Z"
  }
}
```

---

### DELETE /meetings/:id

**Description**: Delete a meeting

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response** (200):

```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

**Error Response** (403):

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to delete this meeting"
  }
}
```

---

### POST /meetings/:id/feedback

**Description**: Add feedback to a meeting

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Request Body**:

```json
{
  "topic": "Technical Skills",
  "comment": "Strong problem-solving skills, good communication",
  "rating": 4
}
```

**Validation**:

- topic: 1-200 characters, required
- comment: max 2000 characters, optional
- rating: integer 1-5, required

**Response** (201):

Returns the full meeting object with populated feedback:

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Technical Interview",
    "candidateName": "Alice Johnson",
    "feedback": [
      {
        "id": "507f1f77bcf86cd799439013",
        "interviewer": {
          "id": "507f1f77bcf86cd799439014",
          "fullName": "Jane Smith"
        },
        "topic": "Technical Skills",
        "comment": "Strong problem-solving skills, good communication",
        "rating": 4,
        "createdAt": "2026-03-15T11:05:00Z"
      }
    ]
  }
}
```

---

## User Endpoints (Admin Only)

### GET /users

**Description**: Get list of users (admin only)

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Query Parameters**:

- `page` (number, default: 1)
- `limit` (number, default: 20)
- `role` (string, optional): filter by role

**Response** (200):

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439012",
        "email": "john@example.com",
        "fullName": "John Doe",
        "role": "recruiter",
        "createdAt": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20
    }
  }
}
```

---

## Common Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

**Document Version**: 1.2
**Last Updated**: March 8, 2026
