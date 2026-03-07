# Phase 2: Database & Authentication

**Timeline**: 4-5 days  
**Status**: Pending Phase 1

---

## Objectives

- Set up MongoDB with Mongoose
- Implement database models and schemas
- Build complete authentication system
- Implement JWT-based security
- Create user management endpoints

---

## Tasks

### 2.1 Database Setup

- [ ] Configure MongoDB connection in Docker
- [ ] Create database configuration module
- [ ] Set up Mongoose connection with retry logic
- [ ] Configure connection pooling
- [ ] Add database health check endpoint

### 2.2 Database Models

- [ ] Create User model with Mongoose schema
  - Email validation and uniqueness
  - Password hashing with bcrypt (null for guests)
  - Role-based fields
  - User type field (user | guest)
  - Refresh token array
  - Timestamps
- [ ] Create Meeting model with Mongoose schema
  - All required fields per spec
  - Embedded feedback schema
  - References to User model
  - Timestamps
- [ ] Define all indexes as per db-schema.md
  - User indexes (email sparse, fingerprint sparse, role, userType, createdAt)
  - Meeting indexes (candidateName, position, startTime, status, createdBy)
  - Compound indexes
  - Text search indexes

### 2.3 Validation Schemas (Zod)

- [ ] Create auth validation schemas
  - Registration schema (user)
  - Guest registration schema (fullName + fingerprint only, no email/password)
  - Login schema
  - Refresh token schema
- [ ] Create user validation schemas
- [ ] Create meeting validation schemas (for Phase 3)
- [ ] Add custom validation rules
  - Password strength
  - Future date validation
  - Time range validation

### 2.4 Authentication Service

- [ ] Implement password hashing utility (bcrypt)
- [ ] Create JWT token generation
  - Access token (15 min expiry)
  - Refresh token (7 day expiry)
- [ ] Implement token verification middleware
- [ ] Create refresh token rotation logic
- [ ] Add token blacklist/revocation mechanism

### 2.5 Authentication Endpoints

- [ ] POST `/api/v1/auth/register`
  - Input validation
  - Duplicate email check
  - Password hashing
  - User creation (userType: 'user')
  - Token generation
- [ ] POST `/api/v1/auth/register/guest`
  - Input validation (fullName + fingerprint only, no email/password)
  - Duplicate fingerprint check
  - User creation without email/password (userType: 'guest')
  - Token generation
  - Frontend generates fingerprint (UUID/FingerprintJS), stores it in localStorage/IndexedDB, and sends it as the unique identity key
- [ ] POST `/api/v1/auth/login`
  - Credential verification (password required; rejects guest accounts)
  - Token generation
  - Refresh token storage
- [ ] POST `/api/v1/auth/login/guest`
  - Fingerprint validation
  - Guest user lookup by fingerprint
  - Token generation
  - Refresh token storage (max 5)
- [ ] POST `/api/v1/auth/refresh`
  - Refresh token validation
  - New access token generation
  - Token rotation
- [ ] POST `/api/v1/auth/logout`
  - Token invalidation
  - Refresh token removal

### 2.6 Middleware

- [ ] Create authentication middleware
  - JWT verification
  - User extraction from token
  - Error handling
- [ ] Create authorization middleware (role-based)
- [ ] Create error handling middleware
- [ ] Create request validation middleware
- [ ] Add rate limiting middleware for auth endpoints

### 2.7 Security Implementation

- [ ] Configure Helmet.js for security headers
- [ ] Set up CORS with proper configuration
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request sanitization
- [ ] Configure secure cookie settings

### 2.8 Testing

- [ ] Unit tests for auth service
- [ ] Unit tests for password hashing
- [ ] Integration tests for auth endpoints
- [ ] Test token expiration and refresh
- [ ] Test role-based authorization

---

## Deliverables

- ✅ MongoDB running in Docker with persistent storage
- ✅ User and Meeting models defined
- ✅ Complete authentication system working
- ✅ All auth endpoints functional and tested
- ✅ Security middleware in place

---

## Success Criteria

- User can register with validation
- Guest can register with fullName + browser fingerprint only (no email, no password)
- Guest registration returns JWT tokens; frontend persists the fingerprint in localStorage/IndexedDB as the sole identity credential
- Guest can re-login via `POST /auth/login/guest` using stored fingerprint when tokens expire
- Regular login endpoint rejects guest accounts (no password → 401)
- User can login and receive tokens
- Token refresh works correctly
- Logout invalidates tokens
- All auth endpoints return proper error responses
- Rate limiting prevents brute force attacks
- Unit test coverage > 80% for auth module

---

## API Endpoints Completed

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/register/guest`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/login/guest`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`

---

## Dependencies

**Required**:

- Phase 1 completed
- MongoDB running
- Environment variables configured

**Next Phase**: Phase 3 (Meeting CRUD Operations)
