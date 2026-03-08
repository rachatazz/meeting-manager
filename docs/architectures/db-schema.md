# Database Schema

## MongoDB Collections

### Collection: `users`

```typescript
{
  _id: ObjectId,
  email: string | null,       // unique (sparse), required for users, null for guests
  password: string | null,    // bcrypt hashed for users, null for guests
  fullName: string,
  role: 'recruiter' | 'interviewer' | 'admin',
  userType: 'user' | 'guest', // indexed
  fingerprint: string | null, // unique (sparse), required for guests, null for users
  refreshTokens: string[],    // array of valid refresh tokens
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `email`: unique sparse, ascending
- `fingerprint`: unique sparse, ascending
- `role`: ascending
- `userType`: ascending
- `createdAt`: descending

---

### Collection: `meetings`

```typescript
{
  _id: ObjectId,
  title: string,              // required, 2-200 chars
  description?: string,       // max 2000 chars
  candidateName: string,      // indexed
  position: string,           // indexed
  startTime: Date,            // indexed
  endTime: Date,
  meetingType: 'online' | 'onsite',
  platform?: string,          // zoom, google-meet, teams, etc.
  meetingLink?: string,
  status: 'pending' | 'confirmed' | 'cancelled',
  notes?: string,             // max 2000 chars
  interviewNotes?: string,    // max 5000 chars
  feedback: [
    {
      _id: ObjectId,
      interviewerId: ObjectId,  // ref: users
      topic?: string,           // max 200 chars
      comment?: string,         // max 2000 chars
      rating: number,           // 1-5
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdBy: ObjectId,        // ref: users, indexed
  createdAt: Date,            // indexed (descending)
  updatedAt: Date
}
```

**Indexes**:

- `candidateName`: text index (for search)
- `position`: text index (for search)
- `startTime`: ascending
- `status`: ascending
- `createdBy`: ascending
- `createdAt`: descending
- Compound index: `{ status: 1, startTime: 1 }`
- Text index: `{ candidateName: 'text', position: 'text' }`

---

## Relationships

```
users (1) ──── (N) meetings
  └─ createdBy

users (1) ──── (N) feedback
  └─ interviewerId (embedded in meetings)
```

---

## Sample Data

### Sample User (regular)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "recruiter@example.com",
  "password": "$2b$10$rKjVhX8qF.8YZqK5vZ5Zxe...",
  "fullName": "John Doe",
  "role": "recruiter",
  "userType": "user",
  "fingerprint": null,
  "refreshTokens": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-03-07T08:00:00Z"
}
```

### Sample User (guest)

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "email": null,
  "password": null,
  "fullName": "Guest User",
  "role": "recruiter",
  "userType": "guest",
  "fingerprint": "a1b2c3d4e5f67890abcdef1234567890",
  "refreshTokens": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
  "createdAt": "2026-03-07T10:00:00Z",
  "updatedAt": "2026-03-07T10:00:00Z"
}
```

### Sample Meeting

```json
{
  "_id": "507f1f77bcf86cd799439012",
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
  "notes": "Technical interview - focus on algorithms and system design",
  "interviewNotes": "Candidate showed strong problem-solving skills",
  "feedback": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "interviewerId": "507f1f77bcf86cd799439014",
      "topic": "Problem Solving",
      "comment": "Excellent problem-solving skills",
      "rating": 5,
      "createdAt": "2026-03-15T11:05:00Z",
      "updatedAt": "2026-03-15T11:05:00Z"
    }
  ],
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2026-03-07T08:30:00Z",
  "updatedAt": "2026-03-15T11:05:00Z"
}
```

---

## Mongoose Schema Definitions

### User Schema

```typescript
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
      default: null,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      default: null,
      select: false,
    },
    fingerprint: {
      type: String,
      required: false,
      default: null,
      unique: true,
      sparse: true,
      select: false,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['recruiter', 'interviewer', 'admin'],
      default: 'recruiter',
      index: true,
    },
    userType: {
      type: String,
      enum: ['user', 'guest'],
      default: 'user',
      index: true,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = model('User', userSchema);
```

### Meeting Schema

```typescript
import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetingType: {
      type: String,
      enum: ['online', 'onsite'],
      required: true,
    },
    platform: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    interviewNotes: {
      type: String,
      maxlength: 5000,
    },
    feedback: [feedbackSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries
meetingSchema.index({ status: 1, startTime: 1 });

// Text index for search
meetingSchema.index({ candidateName: 'text', position: 'text' });

// Descending index for sorting by creation date
meetingSchema.index({ createdAt: -1 });

export const Meeting = model('Meeting', meetingSchema);
```

---

## Database Migrations

### Initial Setup

```javascript
// Create indexes
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.users.createIndex({ fingerprint: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

db.meetings.createIndex({ candidateName: 1 });
db.meetings.createIndex({ position: 1 });
db.meetings.createIndex({ startTime: 1 });
db.meetings.createIndex({ status: 1 });
db.meetings.createIndex({ createdBy: 1 });
db.meetings.createIndex({ createdAt: -1 });
db.meetings.createIndex({ status: 1, startTime: 1 });
db.meetings.createIndex({ candidateName: 'text', position: 'text' });
```

---

## Data Validation Rules

### User Validation

- Email: required and unique for `userType: 'user'`; `null` for guests (sparse unique index)
- Password: bcrypt hashed (cost factor 10) for `userType: 'user'`; `null` for guests
- Fingerprint: required and unique for `userType: 'guest'`; `null` for regular users (sparse unique index)
- Full name: 2-100 characters, required for all user types
- Role must be one of: recruiter, interviewer, admin
- User type must be one of: user, guest
- Guest users cannot authenticate via `POST /auth/login`; the frontend persists the fingerprint in localStorage/IndexedDB as the guest's sole identity credential

### Meeting Validation

- Title: 2-200 characters, required
- Description: max 2000 characters, optional
- Candidate name: 2-100 characters, required
- Position: 2-100 characters, required
- Start time must be in the future (on creation)
- End time must be after start time
- Meeting type must be 'online' or 'onsite'
- Platform required if meeting type is 'online'
- Meeting link: valid URL, optional
- Status must be one of: pending, confirmed, cancelled
- Notes: max 2000 characters, optional
- Interview notes: max 5000 characters, optional

### Feedback Validation

- Topic: 1-200 characters, required
- Comment: max 2000 characters, optional
- Rating: integer 1-5, required
- Interviewer ID must reference valid user

---

**Document Version**: 1.2
**Last Updated**: March 8, 2026
