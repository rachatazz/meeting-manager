# Phase 4: Frontend Development

**Timeline**: 6-7 days  
**Status**: Pending Phase 3

---

## Objectives

- Build complete Nuxt 4 frontend application
- Implement PrimeVue UI components with Aura theme
- Create responsive and accessible interface following wireframe specifications
- Integrate with backend API
- Implement state management with Pinia

---

## Design System (Wireframe Spec)

### Color Palette

- **Primary Orange**: #F97316 (CTAs, highlights) - Hover: #EA580C
- **Secondary Blue**: #3B82F6 (Links, secondary actions) - Hover: #2563EB
- **Dark Navy**: #0F172A (Text, headers)
- **Primary Blue**: #1E3A8A (Deep blue for headers)
- **Neutral**: #F8FAFC (bg), #64748B (muted text), #E2E8F0 (borders)
- **Status Colors**:
  - Confirmed: #D1FAE5 (bg) / #065F46 (text)
  - Pending: #FEF3C7 (bg) / #92400E (text)
  - Cancelled: #FEE2E2 (bg) / #991B1B (text)
  - Completed: #DBEAFE (bg) / #1E40AF (text)

### Typography

- **Font**: Inter (imported from Google Fonts)
- **Sizes**: H1 (2.5rem), H2 (2rem), H3 (1.5rem), Body (1rem), Small (0.875rem)

### Spacing

- 8px grid system (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px)

---

## Tasks

### 4.1 Frontend Configuration

- [ ] Configure Nuxt 4 with app directory structure
- [ ] Set up PrimeVue with Aura theme
- [ ] Configure TailwindCSS with custom colors (wireframe spec)
- [ ] Import Inter font family via `app/assets/css/main.css`
- [ ] Set up auto-imports for components (stores in `app/stores/`)
- [ ] Configure API base URL
- [ ] Set up fetch interceptors (token refresh on 401)

### 4.2 Pinia Stores

- [ ] Create auth store (`app/stores/auth.ts`) — localStorage persistence, setAuth/setAccessToken/clearAuth
- [ ] Create meeting store (`app/stores/meeting.ts`) — list, currentMeeting, pagination, filters, loading, error
- [ ] UI store — skipped, using PrimeVue Toast/ConfirmDialog services directly

### 4.3 Composables

- [ ] Create `useAuth` composable — login, register, registerGuest, loginGuest, logout; fingerprint via `crypto.randomUUID()` + localStorage
- [ ] Create `useApi` composable — `$fetch` wrapper, token injection, auto token refresh on 401
- [ ] Create `useMeetings` composable — fetchMeetings, fetchMeeting, createMeeting, updateMeeting, deleteMeeting, addFeedback

### 4.4 Authentication Pages (Wireframe: 01-login, 02-register)

- [ ] `/auth/login` page
  - White card (400px max-width), centered layout
  - Orange circle logo icon, "Meeting Manager" title
  - Email + Password inputs with validation
  - Orange "Login" button (primary CTA)
  - "Continue as Guest" outlined button
  - "Don't have account? Register" link
  - Dark navy gradient background (auth layout)
- [ ] `/auth/register` page
  - White card, centered layout
  - Full Name, Email, Password, Confirm Password, Role dropdown
  - Password strength indicator (progress bar: red→yellow→green)
  - Real-time validation with error messages
  - Orange "Create Account" button
  - "Already have account? Login" link
- [ ] `/auth/register/guest` page
  - White card with orange icon
  - Full Name input only
  - Auto-generates fingerprint (UUID v4) via `crypto.randomUUID()`
  - Auto-login returning guest via stored fingerprint
  - Loading state for fingerprint check
- [ ] Auth middleware for protected routes
- [ ] Auth layout (`app/layouts/auth.vue`) — dark navy gradient background, centered card

### 4.5 Meeting Management Pages (Wireframe: 03-dashboard, 04-booking, 05-candidate-summary)

- [ ] `/dashboard` page (Wireframe 03)
  - **Card-based layout** (NOT DataTable) with meeting cards
  - Each card: candidate name • position, date/time, location/platform, status badge
  - Search bar (IconField with magnifying glass)
  - Status filter dropdown (All, Confirmed, Pending, Cancelled, Completed)
  - Sort dropdown (Date Newest/Oldest, Name A-Z, Status)
  - Custom pagination (← Previous | Page X of Y | Next →)
  - Hover effect: shadow-md + translateY(-2px)
  - Action buttons per card: View Details (blue), Edit (outlined), Cancel (red outlined)
  - Empty state: "No meetings found" with calendar icon
  - Skeleton loading cards with shimmer animation
  - "+ Schedule Meeting" orange button (top right)
- [ ] `/meetings/new` page (Wireframe 04)
  - "← Back to Dashboard" link
  - "Schedule a New Meeting" title
  - White card form container (800px max-width, centered)
  - **Sections with dividers**:
    - Candidate Information: Name (autocomplete with search icon), Position dropdown
    - Meeting Details: Date picker, Start/End time dropdowns (15-min intervals), Meeting Type (radio: Online/Onsite)
    - Conditional: Platform dropdown (if Online) OR Room/Location input (if Onsite)
    - Additional Information: Notes textarea, Interviewers list (optional, add/remove)
  - Bottom actions: Cancel (outlined) | Book Meeting (orange)
- [ ] `/meetings/[id]` page (Wireframe 05)
  - "← Back to Dashboard" link
  - Candidate header card: Avatar (blue circle with initials), name, position, email, status badge
  - Action buttons row: Edit Meeting (blue), Cancel Meeting (red outlined), Add Feedback (orange)
  - Meeting Information card: Date/time (calendar icon), Location (pin/video icon), Interviewers
  - Interview Notes card: Textarea + Save Notes button (blue)
  - Feedback & Evaluations card: Star ratings (yellow), author name, date, comment text
  - Dividers between feedback items
- [ ] `/meetings/[id]/edit` page
  - Same as `/meetings/new` but pre-filled with meeting data
  - Additional Status field (dropdown)
  - "← Back to Meeting" link
  - "Update Meeting" button instead of "Book Meeting"

### 4.6 UI Components (Wireframe: 06-components)

- [ ] `StatusBadge` component (custom, NOT PrimeVue Tag severity)
  - Props: status ('confirmed' | 'pending' | 'cancelled' | 'completed')
  - Custom pill badges with icons per status:
    - Confirmed: #D1FAE5 bg, #065F46 text, check-circle icon
    - Pending: #FEF3C7 bg, #92400E text, clock icon
    - Cancelled: #FEE2E2 bg, #991B1B text, x-circle icon
    - Completed: #DBEAFE bg, #1E40AF text, check icon
  - Rounded-full, 0.75rem font, medium weight
- [ ] `MeetingForm` component (reusable for create/edit)
  - Props: meeting (optional), mode ('create' | 'edit')
  - Section headers with bottom borders
  - Autocomplete for candidate name
  - Conditional fields (online: platform dropdown, onsite: room input)
  - Date picker (PrimeVue Calendar) with orange selected date
  - Time dropdowns (15-min intervals, 8 AM - 8 PM)
  - Orange "Book Meeting" / "Update Meeting" button
  - Cancel button (outlined)
- [ ] `FeedbackList` component
  - Display feedback items with dividers
  - Avatar initials (blue circle) for each author
  - Yellow star icons (manual rendering, NOT PrimeVue Rating component)
  - Format: ⭐⭐⭐⭐⭐ 4.5/5
  - Author name - Date
  - Comment text
- [ ] `FeedbackForm` component
  - Clickable star rating (5 stars, interactive hover)
  - Comment textarea (4 rows)
  - Orange "Submit" button
  - Cancel button (outlined)
  - Validation: rating and comment required
- [ ] Navbar (integrated into `app/layouts/default.vue`)
  - White background, sticky top, border-bottom
  - Orange circle logo + "Meeting Manager" title
  - User section (right): Avatar with initials (blue circle), name, role badge (light blue bg), ghost logout button
- [ ] ConfirmDialog — via PrimeVue ConfirmationService plugin, placed in default layout
- [ ] LoadingSpinner — using PrimeVue ProgressSpinner inline, no separate component

### 4.7 Layouts (Wireframe Spec)

- [ ] Default layout (`app/layouts/default.vue`)
  - White sticky navbar (64px height, border-bottom #E2E8F0)
  - Orange circle logo (32px) + "Meeting Manager" title
  - User section: Avatar (40px blue circle with initials), name, role badge (light blue pill), ghost logout button
  - ConfirmDialog component placed here (global)
  - Main content area with white background
- [x] Auth layout (`app/layouts/auth.vue`)
  - Dark navy gradient background (#0F172A → #1E3A8A)
  - Centered card container (400px max-width)
  - Orange circle icon (64px) at top
  - White title text
  - Responsive: full-width on mobile
- [ ] Error page (`app/error.vue`)
  - 404: "Page not found" with icon
  - 500: "Server error" with icon
  - "Back to Dashboard" button (orange)

### 4.8 PrimeVue Integration

- [ ] ~~DataTable~~ — **NOT USED**, replaced with custom card-based layout per wireframe
- [ ] Calendar (DatePicker) — date selection in MeetingForm, orange selected date
- [ ] Select (Dropdown) — filters, meeting type, platform, status, role
- [ ] InputText — all text inputs
- [ ] IconField + InputIcon — search bar with magnifying glass
- [ ] Textarea — notes, feedback comments
- [ ] Button — all actions (custom colors via class)
- [ ] ConfirmDialog — delete/cancel confirmation modals
- [ ] Toast — success/error notifications (top-right position)
- [ ] ~~Tag~~ — **NOT USED**, custom StatusBadge component instead
- [ ] ~~Paginator~~ — **NOT USED**, custom pagination component (← Previous | Page X of Y | Next →)
- [ ] ~~Rating~~ — **NOT USED**, manual star rendering in FeedbackList/Form
- [ ] Message — inline error display in forms
- [ ] ProgressSpinner — loading states (skeleton cards, button loading)
- [ ] ~~AutoComplete~~ — candidate name search (if needed, or use InputText with manual search)

### 4.9 Responsive Design (Wireframe Spec)

- [ ] Mobile-first approach with TailwindCSS
- [ ] Breakpoints:
  - Mobile: < 640px (sm:)
  - Tablet: 640px - 1024px (md:, lg:)
  - Desktop: > 1024px (xl:)
- [ ] Responsive behaviors:
  - Dashboard: Single column cards, stack filters vertically on mobile
  - Forms: Two-column time pickers on desktop → single column on mobile
  - Navbar: Hide search on mobile (show in filter bar instead)
  - Cards: Full-width on mobile, max-width on desktop
  - Buttons: Full-width on mobile, auto-width on desktop
  - Auth pages: 400px max-width on desktop, 100% width on mobile
- [ ] Card hover effects: shadow-md + translateY(-2px) with 0.2s transition
- [ ] Tested on various screen sizes

### 4.10 Accessibility (WCAG 2.1 AA)

- [ ] Semantic HTML (form labels, headings hierarchy)
- [ ] All inputs have visible labels
- [ ] Required fields marked with asterisk (\*)
- [ ] PrimeVue built-in ARIA attributes
- [ ] Custom ARIA labels for icons and buttons
- [ ] Keyboard navigation:
  - Tab order follows visual flow
  - Enter to submit forms
  - Escape to close modals
  - Arrow keys for dropdowns
- [ ] Focus visible states (blue border on focus)
- [ ] Color contrast meets WCAG AA:
  - Text: #0F172A on white (21:1)
  - Buttons: white on #F97316 (4.5:1)
  - Status badges: high contrast text/bg combinations
- [ ] Screen reader friendly error messages
- [ ] Skip to content link (optional)

### 4.11 Error Handling & UX (Wireframe Spec)

- [ ] Global error handler (`app/error.vue`) — 404/500 pages
- [ ] Toast notifications:
  - Success: green bg, check icon, "Meeting scheduled successfully!"
  - Error: red bg, x icon, error message
  - Position: top-right
  - Duration: 3-5 seconds
  - Auto-dismiss + manual close (X button)
- [ ] Loading states:
  - Skeleton cards (3-5) with shimmer animation on dashboard
  - Button loading: spinner icon + "Loading..." text
  - ProgressSpinner for async operations
- [ ] Empty states:
  - Dashboard: Calendar icon + "No meetings found" + "Schedule your first meeting" + CTA button
  - FeedbackList: "No feedback yet" message
- [ ] Form validation:
  - Real-time validation on blur/input
  - Red border (#EF4444) on invalid fields
  - Error messages below fields (0.75rem, red text)
  - Message component for inline errors
  - Disabled submit button until valid
- [ ] Confirmation modals:
  - Cancel meeting: "Are you sure you want to cancel this meeting with [Name]?"
  - Delete: "This action cannot be undone"
  - Actions: Cancel (gray) | Confirm (red)

### 4.12 API Integration

- [ ] `POST /auth/register` — fullName, email, password, role
- [ ] `POST /auth/register/guest` — fullName + fingerprint (UUID v4)
- [ ] `POST /auth/login` — email, password
- [ ] `POST /auth/login/guest` — fingerprint only (returning guest)
- [ ] `POST /auth/refresh` — auto on 401 via `useApi` interceptor
- [ ] `POST /auth/logout` — clear tokens, redirect to login
- [ ] Meeting API calls:
  - `GET /meetings` — list with pagination, filters, search
  - `GET /meetings/:id` — detail view
  - `POST /meetings` — create new meeting
  - `PUT /meetings/:id` — update meeting
  - `DELETE /meetings/:id` — delete meeting
  - `POST /meetings/:id/feedback` — add feedback (rating + comment)
- [ ] Token management:
  - Access token in Authorization header
  - Refresh token in httpOnly cookie (or localStorage)
  - Auto refresh on 401 response
  - Redirect to login on refresh failure
- [ ] Error handling:
  - Field-level errors (email exists, validation)
  - Toast for server errors
  - Message component for inline errors
  - Graceful degradation

---

## Deliverables

- [ ] Fully functional frontend application
- [ ] All pages implemented following wireframe specifications
- [ ] Responsive design across devices (mobile/tablet/desktop)
- [ ] Complete API integration with error handling
- [ ] Accessible UI (WCAG 2.1 AA compliant)
- [ ] Custom components per wireframe spec (StatusBadge, FeedbackList, etc.)
- [ ] Card-based dashboard layout (NOT DataTable)
- [ ] Custom pagination and status badges

---

## Success Criteria

### Authentication

- [ ] Users can register with full validation (password strength, confirm password)
- [ ] Users can login with email/password
- [ ] Guests can register with name only; fingerprint auto-generated via `crypto.randomUUID()` and stored in localStorage
- [ ] Returning guest browser auto-detects stored fingerprint and re-authenticates via `POST /auth/login/guest`
- [ ] Guest session persists until browser storage is cleared
- [ ] Token refresh automatically on 401 response

### Meeting Management

- [ ] Users can view meeting list as cards (NOT DataTable) with hover effects
- [ ] Search meetings by candidate name/position
- [ ] Filter by status (All, Confirmed, Pending, Cancelled, Completed)
- [ ] Sort by date, name, status
- [ ] Custom pagination (← Previous | Page X of Y | Next →)
- [ ] Users can create new meetings with conditional fields (online/onsite)
- [ ] Users can edit existing meetings
- [ ] Users can cancel meetings with confirmation modal
- [ ] Users can add feedback with star rating and comment

### UI/UX

- [ ] Card-based layout with hover effects (shadow + lift)
- [ ] Custom StatusBadge component (NOT PrimeVue Tag severity)
- [ ] Manual star rating rendering (NOT PrimeVue Rating)
- [ ] Avatar initials in blue circles
- [ ] Orange primary buttons, blue secondary buttons
- [ ] Section headers with bottom borders
- [ ] Skeleton loading cards with shimmer animation
- [ ] Empty states with icons and CTAs
- [ ] Toast notifications (top-right, auto-dismiss)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Smooth transitions and animations

### Design System

- [ ] Inter font family throughout
- [ ] Custom color palette (orange primary, blue secondary, navy text)
- [ ] Status colors per wireframe spec
- [ ] 8px grid spacing system
- [ ] Consistent border radius (0.375rem buttons, 0.5rem cards)
- [ ] WCAG AA color contrast

---

## Pages Completed (Wireframe Aligned)

### Authentication (Wireframe 01-02)

- [ ] `/auth/login` - Login page (white card, orange button, dark gradient bg)
- [ ] `/auth/register` - Registration page (password strength, confirm password)
- [ ] `/auth/register/guest` - Guest registration (name only, auto fingerprint)

### Meeting Management (Wireframe 03-05)

- [ ] `/dashboard` - Meeting list (card-based, NOT DataTable, custom pagination)
- [ ] `/meetings/new` - Create meeting (sections with dividers, conditional fields)
- [ ] `/meetings/[id]` - Meeting detail (avatar, info card, notes, feedback list)
- [ ] `/meetings/[id]/edit` - Edit meeting (pre-filled form, status field)

### Layouts

- [ ] `app/layouts/default.vue` - White navbar, orange logo, user section
- [ ] `app/layouts/auth.vue` - Dark gradient background, centered card
- [ ] `app/error.vue` - 404/500 error pages

### Components (Wireframe 06)

- [ ] `StatusBadge` - Custom pill badges (NOT PrimeVue Tag)
- [ ] `MeetingForm` - Reusable form (create/edit modes)
- [ ] `FeedbackList` - Manual star rendering (NOT PrimeVue Rating)
- [ ] `FeedbackForm` - Clickable star rating + comment

---

## Key Implementation Notes

### Wireframe Deviations from Initial Plan

1. **Dashboard**: Card-based layout instead of DataTable
2. **Pagination**: Custom component instead of PrimeVue Paginator
3. **StatusBadge**: Custom component instead of PrimeVue Tag with severity
4. **Rating**: Manual star rendering instead of PrimeVue Rating component
5. **Avatar**: Blue circle with initials instead of image
6. **Sections**: Headers with bottom borders in forms
7. **Colors**: Custom orange (#F97316) and blue (#3B82F6) instead of PrimeVue defaults

### Helper Functions

- `formatDateRange()` - Format date range for display (used in dashboard and detail page)
- `getInitials()` - Extract initials from full name for avatars
- Avatar component or utility for consistent blue circle rendering

### Type Definitions

- `IMeetingListItem` - No `location` field, only `platform` for online meetings
- `IMeeting.id` (not `_id`) for detail page
- `IMeetingListItem._id` for list items

---

## Dependencies

**Required**:

- [ ] Phase 3 completed
- [ ] Backend API running
- [ ] All API endpoints functional

**Technologies**:

- [ ] Nuxt 4 + Vue 3
- [ ] PrimeVue (Aura theme)
- [ ] TailwindCSS (custom config)
- [ ] Pinia (state management)
- [ ] Inter font (Google Fonts)
- [ ] PrimeIcons

**Next Phase**: Phase 5 (Testing & Quality Assurance)
