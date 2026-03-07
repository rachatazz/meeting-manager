# Dashboard Page Wireframe

## Page Overview
Main dashboard displaying upcoming meetings with search, filter, and management capabilities.

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Meeting Manager    [Search]  [Filter]  [User] [Logout] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Upcoming Meetings                        [+ Schedule Meeting] │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  [🔍 Search meetings...]  [Status: All ▼]  [Sort: Date ▼]    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Alice Johnson • Software Engineer          [Confirmed]   │ │
│  │ Oct 12, 2025 · 10:00 AM – 11:00 AM                       │ │
│  │ 📍 Online (Zoom)                                          │ │
│  │ [View Details]  [Edit]  [Cancel]                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Bob Smith • Backend Developer              [Pending]     │ │
│  │ Oct 13, 2025 · 2:00 PM – 3:00 PM                         │ │
│  │ 📍 Onsite - Room 301                                      │ │
│  │ [View Details]  [Edit]  [Cancel]                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Carol White • Frontend Developer           [Confirmed]   │ │
│  │ Oct 14, 2025 · 11:00 AM – 12:00 PM                       │ │
│  │ 📍 Online (Google Meet)                                   │ │
│  │ [View Details]  [Edit]  [Cancel]                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [← Previous]  Page 1 of 5  [Next →]                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation Bar
- **Height**: 64px
- **Background**: White (#FFFFFF)
- **Border Bottom**: 1px solid #E2E8F0
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Padding**: 0 2rem (32px)
- **Position**: Sticky top

#### Logo & Title
- **Logo**: Company icon (32px × 32px)
- **Title**: "Meeting Manager"
  - Font: Inter, Semibold
  - Size: 1.125rem (18px)
  - Color: #0F172A
  - Margin Left: 0.75rem (12px)

#### Search Bar (Center)
- **Width**: 400px
- **Height**: 2.5rem (40px)
- **Background**: #F8FAFC
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Placeholder**: "Search meetings..."
- **Icon**: Magnifying glass (left side)
- **Focus State**: Border #3B82F6, background white

#### Filter Button
- **Text**: "Filter"
- **Icon**: Filter icon
- **Height**: 2.5rem (40px)
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Padding**: 0.5rem 1rem
- **Hover**: Background #F8FAFC

#### User Section (Right)
- **Avatar**: Circular, 40px diameter
  - Background: #3B82F6
  - Text: User initials (white)
  - Border: 2px solid white
  
- **User Name**: 
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  
- **Role Badge**:
  - Background: #DBEAFE (light blue)
  - Text Color: #1E40AF
  - Padding: 0.25rem 0.5rem
  - Border Radius: 9999px (full)
  - Font Size: 0.75rem (12px)

- **Logout Button**:
  - Text: "Logout"
  - Icon: Log out icon
  - Height: 2.5rem (40px)
  - Background: Transparent
  - Text Color: #64748B
  - Hover: Background #F8FAFC

### 2. Page Header
- **Padding**: 2rem (32px)
- **Background**: White

#### Title Section
- **Title**: "Upcoming Meetings"
  - Font: Inter, Bold
  - Size: 2rem (32px)
  - Color: #0F172A
  
- **Schedule Button** (Right aligned):
  - Text: "+ Schedule Meeting"
  - Background: #F97316 (Primary Orange)
  - Text Color: White
  - Height: 2.5rem (40px)
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 1.5rem
  - Icon: Plus icon
  - Hover: Background #EA580C

### 3. Filter Bar
- **Padding**: 0 2rem (32px)
- **Margin Bottom**: 1.5rem (24px)
- **Display**: Flex, gap 1rem

#### Search Input
- **Width**: Flexible (flex-1)
- **Height**: 2.5rem (40px)
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Placeholder**: "🔍 Search meetings..."
- **Padding**: 0.5rem 0.75rem

#### Status Dropdown
- **Label**: "Status:"
- **Width**: 150px
- **Height**: 2.5rem (40px)
- **Options**:
  - All
  - Confirmed
  - Pending
  - Cancelled
  - Completed
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)

#### Sort Dropdown
- **Label**: "Sort:"
- **Width**: 150px
- **Height**: 2.5rem (40px)
- **Options**:
  - Date (Newest)
  - Date (Oldest)
  - Candidate Name (A-Z)
  - Status
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)

### 4. Meeting Card
- **Width**: 100%
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1.5rem (24px)
- **Margin Bottom**: 1rem (16px)
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Hover**: Shadow 0 4px 6px rgba(0, 0, 0, 0.1), transform translateY(-2px)
- **Transition**: all 0.2s ease

#### Card Header
- **Candidate Name & Position**:
  - Font: Inter, Semibold
  - Size: 1.125rem (18px)
  - Color: #0F172A
  - Format: "Name • Position"
  - Separator: Bullet point (•)

- **Status Badge** (Right aligned):
  - **Confirmed**: 
    - Background: #D1FAE5
    - Text: #065F46
    - Icon: Check circle
  - **Pending**:
    - Background: #FEF3C7
    - Text: #92400E
    - Icon: Clock
  - **Cancelled**:
    - Background: #FEE2E2
    - Text: #991B1B
    - Icon: X circle
  - **Completed**:
    - Background: #DBEAFE
    - Text: #1E40AF
    - Icon: Check
  - Padding: 0.25rem 0.75rem
  - Border Radius: 9999px (full)
  - Font Size: 0.75rem (12px)
  - Font Weight: Medium

#### Card Body
- **Date & Time**:
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #64748B
  - Icon: Calendar icon
  - Format: "MMM DD, YYYY · HH:MM AM/PM – HH:MM AM/PM"
  - Margin Bottom: 0.5rem (8px)

- **Location**:
  - Font: Inter, Regular
  - Size: 0.875rem (14px)
  - Color: #64748B
  - Icon: Location pin (📍) or Video camera
  - Format: "Online (Platform)" or "Onsite - Room"
  - Margin Bottom: 1rem (16px)

#### Card Actions
- **Display**: Flex, gap 0.75rem
- **Alignment**: Left

- **View Details Button**:
  - Text: "View Details"
  - Background: #3B82F6
  - Text Color: White
  - Height: 2rem (32px)
  - Padding: 0.5rem 1rem
  - Border Radius: 0.375rem (6px)
  - Font Size: 0.875rem (14px)
  - Hover: Background #2563EB

- **Edit Button**:
  - Text: "Edit"
  - Icon: Pencil icon
  - Background: Transparent
  - Border: 1px solid #E2E8F0
  - Text Color: #64748B
  - Height: 2rem (32px)
  - Padding: 0.5rem 1rem
  - Border Radius: 0.375rem (6px)
  - Font Size: 0.875rem (14px)
  - Hover: Background #F8FAFC

- **Cancel Button**:
  - Text: "Cancel"
  - Icon: X icon
  - Background: Transparent
  - Border: 1px solid #FEE2E2
  - Text Color: #EF4444
  - Height: 2rem (32px)
  - Padding: 0.5rem 1rem
  - Border Radius: 0.375rem (6px)
  - Font Size: 0.875rem (14px)
  - Hover: Background #FEF2F2

### 5. Pagination
- **Padding**: 2rem (32px)
- **Display**: Flex, justify center, align center
- **Gap**: 1rem (16px)

#### Previous Button
- **Text**: "← Previous"
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1rem
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Disabled State**: Opacity 0.5, cursor not-allowed
- **Hover**: Background #F8FAFC

#### Page Info
- **Text**: "Page X of Y"
- **Font**: Inter, Medium
- **Size**: 0.875rem (14px)
- **Color**: #64748B

#### Next Button
- **Text**: "Next →"
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1rem
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Disabled State**: Opacity 0.5, cursor not-allowed
- **Hover**: Background #F8FAFC

## States & Interactions

### Empty State
- **Icon**: Calendar with X
- **Title**: "No meetings found"
- **Description**: "Schedule your first meeting to get started"
- **Button**: "+ Schedule Meeting"
- **Centered**: Vertically and horizontally

### Loading State
- Skeleton cards (3-5)
- Shimmer animation
- Gray backgrounds (#F8FAFC)

### Error State
- **Icon**: Alert triangle
- **Title**: "Failed to load meetings"
- **Description**: Error message
- **Button**: "Try Again"

### Cancel Confirmation Modal
- **Title**: "Cancel Meeting?"
- **Message**: "Are you sure you want to cancel this meeting with [Candidate Name]?"
- **Actions**:
  - "Cancel" (gray, dismiss)
  - "Yes, Cancel Meeting" (red, confirm)

## Responsive Behavior

### Desktop (>1024px)
- Full layout as described
- Cards in single column
- Max width: 1200px, centered

### Tablet (768px - 1024px)
- Reduce padding to 1.5rem
- Stack filter controls vertically
- Full-width cards

### Mobile (<768px)
- Single column layout
- Hide search in navbar, show in filter bar
- Stack card actions vertically
- Reduce font sizes slightly
- Compact pagination

## Accessibility
- Keyboard navigation for all interactive elements
- ARIA labels for icons and buttons
- Focus visible states
- Screen reader announcements for status changes
- Semantic HTML (header, main, nav)
- Skip to content link
