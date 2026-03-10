# Meeting Manager

A web-based Meeting Manager application that enables recruiters and hiring managers to efficiently schedule, manage, and track candidate interviews with a modern, intuitive interface.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Runtime**: Node.js >= 24
- **Frontend**: Nuxt 4 + PrimeVue 4 + TailwindCSS 3 + Pinia
- **Backend**: Express.js 4 + JWT + Zod + Mongoose 8
- **Database**: MongoDB 7.x
- **Language**: TypeScript (strict mode)
- **Testing**: Jest + Supertest + mongodb-memory-server
- **Containerization**: Docker + Docker Compose

## Features

- **Authentication**: Register/login with JWT (access + refresh tokens), guest access via browser fingerprint
- **Meeting CRUD**: Create, view, edit, and delete candidate meetings
- **Dashboard**: List upcoming meetings with pagination, search, and status filter
- **Meeting Summary**: Aggregated meeting statistics
- **Meeting Details**: View full meeting info, add interview notes, update status
- **Feedback**: Interviewers and admins can add interview feedback with topic, comment, and rating

## Project Structure

```
meeting-manager/
├── apps/
│   ├── frontend/              # Nuxt 4 application
│   │   ├── app/
│   │   │   ├── assets/css/    # main.css, tailwind.css
│   │   │   ├── components/    # MeetingForm, FeedbackForm, FeedbackList, StatusBadge, MeetingCard
│   │   │   ├── composables/   # useApi, useAuth, useMeetings
│   │   │   ├── layouts/       # default.vue, auth.vue
│   │   │   ├── middleware/    # auth.ts
│   │   │   ├── pages/         # index, dashboard, auth/*, meetings/*
│   │   │   ├── plugins/       # auth.client.ts
│   │   │   └── stores/        # auth.ts, meeting.ts
│   │   └── nuxt.config.ts
│   └── backend/               # Express.js API
│       ├── src/
│       │   ├── config/        # env.ts, database.ts
│       │   ├── controllers/   # auth.controller.ts, meeting.controller.ts
│       │   ├── middlewares/   # authenticate.ts, authorize.ts, validate.ts, errorHandler.ts
│       │   ├── models/        # User.ts, Meeting.ts
│       │   ├── routes/        # auth.routes.ts, meeting.routes.ts, index.ts
│       │   ├── services/      # auth.service.ts, meeting.service.ts
│       │   ├── utils/         # errors.ts
│       │   └── validators/    # auth.validator.ts, meeting.validator.ts, user.validator.ts
│       └── tests/
│           ├── unit/
│           ├── integration/
│           └── helpers/       # db.ts (mongodb-memory-server)
├── packages/
│   └── shared/                # Shared TypeScript types & constants
│       └── src/
│           ├── types/         # user.ts, meeting.ts, api.ts
│           └── constants/     # index.ts
├── docker/                    # Dockerfile.backend, Dockerfile.frontend
├── docs/                      # Architecture docs, wireframes, plans
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js >= 24
- pnpm >= 9
- Docker & Docker Compose
- Git

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example apps/backend/.env
cp .env.example apps/frontend/.env
```

### Environment Variables

```bash
# Backend (apps/backend/.env)
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/meeting-manager
JWT_SECRET=your-jwt-secret-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# Frontend (apps/frontend/.env)
NUXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Development

```bash
# Start MongoDB (Docker)
docker compose -f docker-compose.dev.yml up mongodb -d

# Start frontend + backend (parallel)
pnpm dev

# OR

# Start backend only
pnpm dev:api

# Start frontend only
pnpm dev:web
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MongoDB: mongodb://localhost:27017

### Run Tests

```bash
# All backend tests
pnpm test:api

# Unit tests only
pnpm test:api:unit

# Integration tests only
pnpm test:api:integration
```

### Linting & Formatting

```bash
# Lint all workspaces
pnpm lint

# Type check all workspaces
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Docker (Production)

```bash
# Copy environment variables
cp .env.example .env

# Start frontend + backend + mongodb
docker compose up -d
```

## API Endpoints

### Auth Routes (`/api/v1/auth`) — Rate limited: 20 req/15min

| Method | Path                          | Description         | Auth     |
| ------ | ----------------------------- | ------------------- | -------- |
| GET    | `/api/v1/auth/me`             | Get current user    | Required |
| POST   | `/api/v1/auth/register`       | Register user       | No       |
| POST   | `/api/v1/auth/register/guest` | Register guest user | No       |
| POST   | `/api/v1/auth/login`          | Login               | No       |
| POST   | `/api/v1/auth/login/guest`    | Guest login         | No       |
| POST   | `/api/v1/auth/refresh`        | Refresh token       | No       |
| POST   | `/api/v1/auth/logout`         | Logout              | Required |

### Meeting Routes (`/api/v1/meetings`)

| Method | Path                            | Description     | Auth     |
| ------ | ------------------------------- | --------------- | -------- |
| GET    | `/api/v1/meetings/summary`      | Meeting summary | Required |
| GET    | `/api/v1/meetings`              | List meetings   | Required |
| GET    | `/api/v1/meetings/:id`          | Get meeting     | Required |
| POST   | `/api/v1/meetings`              | Create meeting  | Required |
| PUT    | `/api/v1/meetings/:id`          | Update meeting  | Required |
| DELETE | `/api/v1/meetings/:id`          | Delete meeting  | Required |
| POST   | `/api/v1/meetings/:id/feedback` | Add feedback    | Required |

See [`docs/architectures/api-spec.md`](docs/architectures/api-spec.md) for full API documentation.

## Documentation

- [`docs/architectures/overview.md`](docs/architectures/overview.md) — Project overview, architecture, and non-functional requirements
- [`docs/architectures/api-spec.md`](docs/architectures/api-spec.md) — Full API specification
- [`docs/architectures/api-test-case.md`](docs/architectures/api-test-case.md) — API test cases
- [`docs/architectures/db-schema.md`](docs/architectures/db-schema.md) — Database schema
- [`docs/architectures/requirement.md`](docs/architectures/requirement.md) — Project requirements
- [`docs/wireframes/`](docs/wireframes/) — UI wireframes (login, register, dashboard, booking form, candidate summary, components)
- [`docs/plans/README.md`](docs/plans/README.md) — Project plan and phase breakdown
