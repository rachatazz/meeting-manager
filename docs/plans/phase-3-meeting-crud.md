# Phase 3: Meeting CRUD Operations

**Timeline**: 4-5 days  
**Status**: Pending Phase 2

---

## Objectives

- Implement complete meeting management system
- Build all CRUD endpoints for meetings
- Add search, filter, and pagination
- Implement feedback system
- Create business logic and validation

---

## Tasks

### 3.1 Meeting Service Layer
- [ ] Create meeting service with business logic
  - Create meeting
  - Get meeting by ID
  - Get meetings list with filters
  - Update meeting
  - Delete meeting
  - Add feedback to meeting
- [ ] Implement ownership validation
- [ ] Add role-based access control logic
- [ ] Create meeting status management

### 3.2 Meeting Endpoints - Read Operations
- [ ] GET `/api/v1/meetings`
  - Pagination (page, limit)
  - Filtering by status
  - Search by candidate name and position
  - Sorting (startTime, createdAt, candidateName)
  - Query parameter validation
  - Response formatting with pagination metadata
- [ ] GET `/api/v1/meetings/:id`
  - Meeting detail retrieval
  - Population of user references
  - Feedback inclusion
  - 404 handling

### 3.3 Meeting Endpoints - Write Operations
- [ ] POST `/api/v1/meetings`
  - Request validation (Zod)
  - Future date validation
  - Time range validation (endTime > startTime)
  - Platform requirement for online meetings
  - Auto-set status to 'pending'
  - Associate with authenticated user
- [ ] PUT `/api/v1/meetings/:id`
  - Partial update support
  - Ownership verification
  - Validation of updated fields
  - Status transition rules
- [ ] DELETE `/api/v1/meetings/:id`
  - Ownership verification
  - Role-based permission check
  - Soft delete option (optional)

### 3.4 Feedback System
- [ ] POST `/api/v1/meetings/:id/feedback`
  - Feedback validation
  - Rating validation (1-5)
  - Associate with authenticated user
  - Add to meeting's feedback array
  - Update meeting timestamps

### 3.5 Advanced Features
- [ ] Implement text search using MongoDB text index
- [ ] Add compound filtering (status + date range)
- [ ] Implement efficient pagination with cursor-based option
- [ ] Add meeting conflict detection (optional)
- [ ] Create meeting statistics endpoint (optional)

### 3.6 Validation & Error Handling
- [ ] Create Zod schemas for all meeting operations
- [ ] Validate date formats (ISO 8601)
- [ ] Validate meeting type and platform combinations
- [ ] Add custom error messages
- [ ] Handle MongoDB validation errors

### 3.7 Database Optimization
- [ ] Verify all indexes are created
- [ ] Test query performance with sample data
- [ ] Optimize population queries
- [ ] Add query result caching (optional)

### 3.8 Testing
- [ ] Unit tests for meeting service
- [ ] Integration tests for all meeting endpoints
- [ ] Test pagination edge cases
- [ ] Test search functionality
- [ ] Test filtering combinations
- [ ] Test authorization rules
- [ ] Test feedback system
- [ ] Load test with 1000+ meetings

---

## Deliverables

- ✅ Complete meeting CRUD API
- ✅ Search and filter functionality
- ✅ Pagination working correctly
- ✅ Feedback system functional
- ✅ All endpoints tested and documented

---

## Success Criteria

- All meeting endpoints return correct data
- Pagination works with large datasets
- Search returns relevant results
- Filters can be combined
- Only authorized users can modify meetings
- Feedback can be added by interviewers
- API response time < 500ms (p95)
- Test coverage > 80%

---

## API Endpoints Completed

- GET `/api/v1/meetings` (with pagination, search, filter)
- GET `/api/v1/meetings/:id`
- POST `/api/v1/meetings`
- PUT `/api/v1/meetings/:id`
- DELETE `/api/v1/meetings/:id`
- POST `/api/v1/meetings/:id/feedback`

---

## Dependencies

**Required**:
- Phase 2 completed
- Authentication working
- Database models ready

**Next Phase**: Phase 4 (Frontend Development)
