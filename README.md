# Meeting Manager

A web-based Meeting Manager application that enables recruiters and hiring managers to efficiently schedule, manage, and track candidate interviews with a modern, intuitive interface.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Runtime**: Node.js v24.14.0
- **Frontend**: Nuxt 4 + PrimeVue 4 + TailwindCSS + Pinia
- **Backend**: Express.js + JWT + Zod + Swagger + Mongoose
- **Database**: MongoDB 7.x
- **Language**: TypeScript (strict mode)
- **Testing**: Jest + Supertest + mongodb-memory-server
- **Containerization**: Docker + Docker Compose

## Features

- **Authentication**: Register/login with JWT (access + refresh tokens), guest access via browser fingerprint
- **Meeting CRUD**: Create, view, edit, and delete candidate meetings
- **Dashboard**: List upcoming meetings with pagination, search, and status filter
- **Meeting Details**: View full meeting info, add interview notes, update status, view history
- **Feedback**: Interviewers and admins can add interview feedback

## User Roles

| Role        | Permissions                                       |
| ----------- | ------------------------------------------------- |
| Recruiter   | Full access to create, edit, delete meetings      |
| Interviewer | View meetings, add feedback                       |
| Admin       | Full system access + user management              |
| Guest       | Register with fullName + browser fingerprint only |

## Project Structure

```
meeting-manager/
├── apps/
│   ├── frontend/              # Nuxt 4 application
│   │   ├── app/               # Pages, components, composables, layouts
│   │   ├── stores/            # Pinia stores
│   │   └── nuxt.config.ts
│   └── backend/               # Express.js API
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   └── validators/
│       └── tests/
│           ├── unit/
│           └── integration/
├── packages/
│   └── shared/                # Shared TypeScript types & constants
├── docker/                    # Dockerfiles
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js v24.14.0
- pnpm 9.x
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

# Start backend
pnpm dev:api

# Start frontend (separate terminal)
pnpm dev:web
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MongoDB: mongodb://localhost:27017

### Run Tests

```bash
# All backend tests
pnpm --filter backend test

# Unit tests only
pnpm --filter backend test:unit

# Integration tests only
pnpm --filter backend test:integration
```

### Docker (Production)

```bash
docker compose up -d
```

## API Endpoints

| Method | Path                            | Description         |
| ------ | ------------------------------- | ------------------- |
| POST   | `/api/v1/auth/register`         | Register user       |
| POST   | `/api/v1/auth/register/guest`   | Register guest user |
| POST   | `/api/v1/auth/login`            | Login               |
| POST   | `/api/v1/auth/login/guest`      | Guest login         |
| POST   | `/api/v1/auth/refresh`          | Refresh token       |
| POST   | `/api/v1/auth/logout`           | Logout              |
| GET    | `/api/v1/meetings`              | List meetings       |
| POST   | `/api/v1/meetings`              | Create meeting      |
| GET    | `/api/v1/meetings/:id`          | Get meeting         |
| PUT    | `/api/v1/meetings/:id`          | Update meeting      |
| DELETE | `/api/v1/meetings/:id`          | Delete meeting      |
| POST   | `/api/v1/meetings/:id/feedback` | Add feedback        |

See [`docs/architectures/api-spec.md`](docs/architectures/api-spec.md) for full API documentation.

## Documentation

- [`docs/architectures/overview.md`](docs/architectures/overview.md) — Project overview, architecture, and non-functional requirements
- [`docs/architectures/api-spec.md`](docs/architectures/api-spec.md) — Full API specification
- [`docs/architectures/db-schema.md`](docs/architectures/db-schema.md) — Database schema
- [`docs/architectures/requirement.md`](docs/architectures/requirement.md) — Project requirements
- [`docs/plans/README.md`](docs/plans/README.md) — Project plan and phase breakdown
