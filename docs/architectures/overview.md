# Meeting Manager - Project Overview

## Product Vision

A web-based Meeting Manager application that enables recruiters and hiring managers to efficiently schedule, manage, and track candidate interviews with a modern, intuitive interface.

---

## Tech Stack

- **Monorepo**: pnpm + workspace
- **Runtime**: Node.js v24.14.0
- **Frontend**: Nuxt 4 + PrimeVue 4 + TailwindCSS + Pinia
- **Backend**: Express.js + JWT + Zod + Mongoose
- **Database**: MongoDB
- **Language**: TypeScript (Strict Mode)
- **Testing**: Unit & E2E tests
- **Containerization**: Docker + Docker Compose

---

## Scope & Requirements

### Core Features

#### Authentication (Optional but Implemented)

- User registration and login
- Guest registration (no password required)
- JWT-based authentication
- Session management
- Logout functionality
- Guest access: frontend registers with fullName only, generates a browser fingerprint (UUID/FingerprintJS) stored in localStorage/IndexedDB; fingerprint is sent to backend as unique identity key

#### Meeting Management (CRUD)

- **Create**: Schedule new candidate meetings
- **Read**: View list of meetings with pagination
- **Update**: Edit meeting details
- **Delete**: Cancel/remove meetings

#### Dashboard

- Display upcoming meetings
- Filter by status (Confirmed, Pending, Cancelled)
- Search by candidate name or position
- Pagination support (10 items per page, max 100)

#### Meeting Details

- View comprehensive meeting information
- Add/edit interview notes
- Update meeting status
- View meeting history

### User Roles

- **Recruiter**: Full access to create, edit, delete meetings
- **Interviewer**: View meetings, add feedback
- **Admin**: Full system access + user management
- **Guest**: Registers with fullName + browser fingerprint only (no email, no password); frontend persists fingerprint locally as the sole identity credential

### Data Model

#### Meeting Entity

- Title (required)
- Description (optional)
- Candidate name
- Position/role applied for
- Date and time (start & end)
- Meeting type (Onsite/Online)
- Platform (Zoom, Google Meet, etc.)
- Status (Pending, Confirmed, Cancelled)
- Notes/description
- Interview notes (post-interview notes, max 5000 chars)
- Interview feedback (topic, comment, rating)
- Created by (user reference)
- Timestamps (created, updated)

#### User Entity

- Email (unique, required for users; null for guests)
- Password (hashed, null for guests)
- Full name
- Role (recruiter, interviewer, admin)
- User type (user, guest)
- Fingerprint (unique sparse, required for guests; null for users)
- Timestamps

### Non-Functional Requirements

- Response time < 500ms for API calls
- Support 100+ concurrent users
- Mobile-responsive design
- Accessibility (WCAG 2.1 AA)
- Data persistence and backup
- Secure authentication (JWT with refresh tokens)

---

## Project Structure

```
meeting-manager/
├── apps/
│   ├── frontend/              # Nuxt 4 application
│   │   ├── app/              # App directory
│   │   │   ├── assets/css/   # main.css, tailwind.css
│   │   │   ├── components/   # MeetingForm, FeedbackForm, FeedbackList, StatusBadge, MeetingCard
│   │   │   ├── composables/  # useApi, useAuth, useMeetings
│   │   │   ├── layouts/      # default.vue, auth.vue
│   │   │   ├── middleware/   # auth.ts
│   │   │   ├── pages/        # index, dashboard, auth/*, meetings/*
│   │   │   ├── plugins/      # auth.client.ts
│   │   │   ├── stores/       # auth.ts, meeting.ts
│   │   │   ├── app.vue
│   │   │   └── error.vue
│   │   ├── public/           # Static files
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   │
│   └── backend/              # Express.js API
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   ├── validators/
│       │   └── app.ts
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── helpers/      # db.ts (mongodb-memory-server)
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/               # Shared types and utilities
│       ├── src/
│       │   ├── types/
│       │   └── constants/
│       └── package.json
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── pnpm-workspace.yaml
├── package.json
├── .env.example
└── README.md
```

---

## Deployment Strategy

### Development Environment

- Docker Compose with hot-reload
- MongoDB local instance
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MongoDB: mongodb://localhost:27017

### Production Environment

- Docker containers orchestrated with Docker Compose
- Nginx reverse proxy
- MongoDB with persistent volumes
- Environment variables for configuration
- SSL/TLS certificates

### CI/CD Pipeline

1. **Build**: Compile TypeScript, run linters
2. **Test**: Unit tests, integration tests, E2E tests
3. **Security**: Dependency scanning, SAST
4. **Deploy**: Build Docker images, push to registry
5. **Release**: Deploy to production environment

---

## Security Considerations

### Authentication

- JWT with short-lived access tokens (15 min)
- Refresh tokens with rotation
- Secure password hashing (bcrypt, cost factor 10) for regular users
- Guest users have no email or password on the server; frontend generates a browser fingerprint (UUID/FingerprintJS), stores it in localStorage/IndexedDB, and sends it as the unique identity key during registration
- Rate limiting on auth endpoints

### Authorization

- Role-based access control (RBAC)
- Resource ownership validation
- API endpoint protection

### Data Protection

- Input validation with Zod
- SQL/NoSQL injection prevention
- XSS protection
- CORS configuration
- Helmet.js security headers

### Infrastructure

- Environment variables for secrets
- Docker secrets management
- HTTPS only in production
- MongoDB authentication enabled

---

## Performance Requirements

### Response Times

- API endpoints: < 500ms (p95)
- Page load: < 2s (p95)
- Database queries: < 100ms (p95)

### Scalability

- Support 100+ concurrent users
- Handle 1000+ meetings
- Horizontal scaling capability

### Optimization

- Database indexing
- API response caching
- Pagination for large datasets
- Lazy loading on frontend

---

## Testing Strategy

### Unit Tests

- Coverage target: > 80%
- Test all services and utilities
- Mock external dependencies

### Integration Tests

- API endpoint testing
- Database integration
- Authentication flow

### E2E Tests

- Critical user journeys
- Cross-browser testing
- Mobile responsiveness

### Performance Tests

- Load testing
- Stress testing
- API response time monitoring

---

## Timeline & Milestones

### Week 1

- ✅ Project setup (monorepo, Docker)
- ✅ Database schema design
- ✅ API specification
- ✅ Authentication implementation

### Week 2

- Meeting CRUD operations
- Frontend UI components
- Integration tests
- Deployment setup

### Week 3

- E2E testing
- Performance optimization
- Documentation
- Production deployment

---

## Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/meeting-manager
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# Frontend (.env)
NUXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Technology Versions

- Node.js: 24.14.0
- pnpm: 9.x
- Nuxt: 4.x
- Vue: 3.x
- PrimeVue: 4.x
- Express: 4.x
- MongoDB: 7.x
- TypeScript: 5.x

---

**Document Version**: 1.3
**Last Updated**: March 10, 2026
**Status**: Approved
