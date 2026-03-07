# Booking Form Page Wireframe

## Page Overview
Form page for scheduling new meetings with candidates.

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Meeting Manager                      [User] [Logout]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ← Back to Dashboard                                           │
│                                                                │
│  Schedule a New Meeting                                        │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Candidate Information                                    │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                                                            │ │
│  │  Candidate Name *                                         │ │
│  │  [_____________________________] [🔍]                     │ │
│  │  Start typing to search...                                │ │
│  │                                                            │ │
│  │  Position *                                               │ │
│  │  [▼ Select Position ___________________]                 │ │
│  │                                                            │ │
│  │  Meeting Details                                          │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                                                            │ │
│  │  Date *                                                   │ │
│  │  [📅 Select Date ___________________]                    │ │
│  │                                                            │ │
│  │  Start Time *              End Time *                     │ │
│  │  [🕐 10:00 AM ▼]          [🕐 11:00 AM ▼]               │ │
│  │                                                            │ │
│  │  Meeting Type *                                           │ │
│  │  ○ Online    ○ Onsite                                     │ │
│  │                                                            │ │
│  │  [If Online]                                              │ │
│  │  Platform *                                               │ │
│  │  [▼ Select Platform ___________________]                 │ │
│  │  • Zoom                                                   │ │
│  │  • Google Meet                                            │ │
│  │  • Microsoft Teams                                        │ │
│  │                                                            │ │
│  │  [If Onsite]                                              │ │
│  │  Room/Location *                                          │ │
│  │  [_____________________________]                          │ │
│  │                                                            │ │
│  │  Additional Information                                   │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                                                            │ │
│  │  Notes                                                    │ │
│  │  [_____________________________]                          │ │
│  │  [                             ]                          │ │
│  │  [                             ]                          │ │
│  │  [                             ]                          │ │
│  │                                                            │ │
│  │  Interviewers (Optional)                                  │ │
│  │  [+ Add Interviewer]                                      │ │
│  │  • John Doe (Senior Engineer)           [×]              │ │
│  │  • Jane Smith (Tech Lead)                [×]              │ │
│  │                                                            │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │                                                            │ │
│  │  [Cancel]                            [Book Meeting]       │ │
│  │                                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation Bar
- Same as Dashboard (see `03-dashboard-page.md`)
- **Height**: 64px
- **Background**: White
- **Border Bottom**: 1px solid #E2E8F0

### 2. Back Navigation
- **Padding**: 2rem (32px) top, 1rem (16px) bottom
- **Link**: "← Back to Dashboard"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #3B82F6
  - Icon: Arrow left
  - Hover: Underline

### 3. Page Header
- **Padding**: 0 2rem (32px)
- **Margin Bottom**: 2rem (32px)

- **Title**: "Schedule a New Meeting"
  - Font: Inter, Bold
  - Size: 2rem (32px)
  - Color: #0F172A

### 4. Form Container
- **Max Width**: 800px
- **Margin**: 0 auto
- **Padding**: 0 2rem (32px)
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 2rem (32px)
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)

### 5. Form Sections

#### Section: Candidate Information
- **Section Title**:
  - Font: Inter, Semibold
  - Size: 1.125rem (18px)
  - Color: #0F172A
  - Margin Bottom: 1.5rem (24px)
  - Border Bottom: 2px solid #E2E8F0
  - Padding Bottom: 0.5rem (8px)

##### Candidate Name Field (Autocomplete)
- **Label**: "Candidate Name *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: text with autocomplete
  - Placeholder: "Start typing to search..."
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Search icon (right side)
  - Focus State: Border #3B82F6

- **Autocomplete Dropdown**:
  - Background: White
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
  - Max Height: 200px
  - Overflow: scroll
  - Item Hover: Background #F8FAFC
  - Item Format: "Name - Position"

- **Helper Text**: "Start typing to search..."
  - Font: Inter, Regular
  - Size: 0.75rem (12px)
  - Color: #64748B
  - Margin Top: 0.25rem (4px)

##### Position Dropdown
- **Label**: "Position *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Dropdown**:
  - Placeholder: "Select Position"
  - Options:
    - Software Engineer
    - Backend Developer
    - Frontend Developer
    - Full Stack Developer
    - DevOps Engineer
    - QA Engineer
    - Product Manager
    - UI/UX Designer
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Chevron down
  - Focus State: Border #3B82F6

#### Section: Meeting Details
- **Section Title**: Same style as Candidate Information
- **Margin Top**: 2rem (32px)

##### Date Picker
- **Label**: "Date *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: date picker
  - Placeholder: "Select Date"
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Calendar icon
  - Focus State: Border #3B82F6

- **Calendar Popup**:
  - Background: White
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.5rem (8px)
  - Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
  - Highlight today: Border #3B82F6
  - Selected date: Background #F97316, text white
  - Disabled dates: Opacity 0.3

##### Time Pickers (Start & End)
- **Layout**: Grid 2 columns, gap 1rem
- **Label**: "Start Time *" / "End Time *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Dropdown**:
  - Options: 15-minute intervals (8:00 AM - 8:00 PM)
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Clock icon
  - Focus State: Border #3B82F6

- **Validation**: End time must be after start time
- **Duration Display**: "Duration: 1 hour" (below fields)
  - Font: Inter, Regular
  - Size: 0.75rem (12px)
  - Color: #64748B

##### Meeting Type (Radio Buttons)
- **Label**: "Meeting Type *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Radio Group**:
  - Display: Flex, gap 2rem
  - Options: "Online" / "Onsite"
  
- **Radio Button**:
  - Size: 20px
  - Border: 2px solid #E2E8F0
  - Checked: Border #F97316, inner circle #F97316
  - Label Font: Inter, Regular
  - Label Size: 0.875rem (14px)
  - Label Color: #0F172A

##### Platform Dropdown (Conditional - Online)
- **Label**: "Platform *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Dropdown**:
  - Placeholder: "Select Platform"
  - Options:
    - Zoom
    - Google Meet
    - Microsoft Teams
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Icon: Platform icon + Chevron down

##### Room/Location Input (Conditional - Onsite)
- **Label**: "Room/Location *"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: text
  - Placeholder: "e.g., Conference Room 301"
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem

#### Section: Additional Information
- **Section Title**: Same style as previous sections
- **Margin Top**: 2rem (32px)

##### Notes Textarea
- **Label**: "Notes"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Textarea**:
  - Placeholder: "Add any additional notes or requirements..."
  - Rows: 4
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.75rem
  - Resize: vertical
  - Focus State: Border #3B82F6

##### Interviewers List (Optional)
- **Label**: "Interviewers (Optional)"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Add Button**:
  - Text: "+ Add Interviewer"
  - Background: Transparent
  - Border: 1px dashed #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Height: 2.5rem (40px)
  - Width: 100%
  - Color: #3B82F6
  - Hover: Background #F8FAFC

- **Interviewer Item**:
  - Display: Flex, justify between
  - Background: #F8FAFC
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.75rem
  - Margin Bottom: 0.5rem (8px)
  
  - **Name & Role**:
    - Font: Inter, Medium
    - Size: 0.875rem (14px)
    - Color: #0F172A
    - Format: "Name (Role)"
  
  - **Remove Button**:
    - Icon: X
    - Size: 20px
    - Color: #64748B
    - Hover: Color #EF4444

### 6. Form Actions
- **Margin Top**: 2rem (32px)
- **Padding Top**: 2rem (32px)
- **Border Top**: 1px solid #E2E8F0
- **Display**: Flex, justify between

#### Cancel Button
- **Text**: "Cancel"
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1.5rem
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Text Color**: #64748B
- **Border Radius**: 0.375rem (6px)
- **Hover**: Background #F8FAFC

#### Submit Button
- **Text**: "Book Meeting"
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 2rem
- **Background**: #F97316 (Primary Orange)
- **Text Color**: White
- **Border Radius**: 0.375rem (6px)
- **Hover**: Background #EA580C
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Loading**: Spinner icon, text "Booking..."

## States & Interactions

### Loading State
- Form disabled
- Submit button shows spinner
- Overlay with opacity

### Success State
- Toast notification: "Meeting scheduled successfully!"
- Redirect to meeting details page

### Error State
- Red border on invalid fields
- Error messages below fields
- Toast notification for server errors

### Validation Rules
- **Candidate Name**: Required
- **Position**: Required
- **Date**: Required, must be future date
- **Start Time**: Required
- **End Time**: Required, must be after start time
- **Meeting Type**: Required
- **Platform** (if online): Required
- **Room/Location** (if onsite): Required

## Responsive Behavior

### Desktop (>768px)
- Two-column layout for time pickers
- Full form width (800px max)

### Tablet (768px)
- Single column layout
- Full-width inputs

### Mobile (<640px)
- Stack all fields vertically
- Full-width buttons
- Reduce padding to 1rem

## Accessibility
- All fields have labels
- Required fields marked with asterisk
- Tab order follows visual flow
- ARIA labels for icons
- Focus visible states
- Error messages announced to screen readers
- Keyboard navigation for date/time pickers
