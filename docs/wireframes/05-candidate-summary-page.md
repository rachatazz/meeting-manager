# Candidate Summary Page Wireframe

## Page Overview
Detailed view of a candidate's meeting with interview notes, history, and feedback management.

## Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Meeting Manager                      [User] [Logout]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ← Back to Dashboard                                           │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ [Avatar] Alice Johnson                                    │ │
│  │          Software Engineer                [Confirmed]     │ │
│  │          alice.johnson@email.com                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [Edit Meeting]  [Cancel Meeting]  [Add Feedback]             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Meeting Information                                       │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ 📅 Oct 12, 2025 · 10:00 AM – 11:00 AM                   │ │
│  │ 📍 Online (Zoom)                                          │ │
│  │ 👥 Interviewers: John Doe, Jane Smith                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Interview Notes                                           │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ [Add notes here...]                                       │ │
│  │                                                            │ │
│  │ [Save Notes]                                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Feedback & Evaluations                                    │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ ⭐⭐⭐⭐⭐ 4.5/5                                            │ │
│  │ John Doe - Oct 12, 2025                                   │ │
│  │ "Strong technical skills..."                              │ │
│  │ ───────────────────────────────────────────────────────  │ │
│  │ ⭐⭐⭐⭐☆ 4.0/5                                            │ │
│  │ Jane Smith - Oct 12, 2025                                 │ │
│  │ "Good communication..."                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Navigation Bar
Same as Dashboard (see `03-dashboard-page.md`)

### 2. Back Navigation
Same as Booking Form (see `04-booking-form-page.md`)

### 3. Candidate Header Card
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1.5rem (24px)
- **Shadow**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Display**: Flex, align center

#### Avatar
- **Size**: 80px × 80px
- **Border Radius**: 9999px (full circle)
- **Background**: #3B82F6
- **Text**: Initials (white)
- **Border**: 3px solid white
- **Shadow**: 0 2px 4px rgba(0, 0, 0, 0.1)

#### Candidate Info
- **Name**: 
  - Font: Inter, Bold
  - Size: 1.5rem (24px)
  - Color: #0F172A
  
- **Position**:
  - Font: Inter, Medium
  - Size: 1rem (16px)
  - Color: #64748B
  
- **Email**:
  - Font: Inter, Regular
  - Size: 0.875rem (14px)
  - Color: #64748B
  - Icon: Mail icon

#### Status Badge
Same as Dashboard cards (right-aligned)

### 4. Action Buttons
- **Margin**: 1.5rem (24px) vertical
- **Display**: Flex, gap 0.75rem

#### Edit Meeting Button
- **Text**: "Edit Meeting"
- **Icon**: Pencil
- **Background**: #3B82F6
- **Text Color**: White
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1.5rem
- **Border Radius**: 0.375rem (6px)

#### Cancel Meeting Button
- **Text**: "Cancel Meeting"
- **Icon**: X circle
- **Background**: Transparent
- **Border**: 1px solid #FEE2E2
- **Text Color**: #EF4444
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1.5rem
- **Border Radius**: 0.375rem (6px)

#### Add Feedback Button
- **Text**: "Add Feedback"
- **Icon**: Plus
- **Background**: #F97316
- **Text Color**: White
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1.5rem
- **Border Radius**: 0.375rem (6px)

### 5. Meeting Information Card
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1.5rem (24px)
- **Margin Bottom**: 1.5rem (24px)

#### Section Title
- **Text**: "Meeting Information"
- **Font**: Inter, Semibold
- **Size**: 1.125rem (18px)
- **Color**: #0F172A
- **Border Bottom**: 2px solid #E2E8F0
- **Padding Bottom**: 0.5rem (8px)
- **Margin Bottom**: 1rem (16px)

#### Info Items
Each item:
- **Display**: Flex, align center
- **Gap**: 0.5rem (8px)
- **Margin Bottom**: 0.75rem (12px)
- **Icon**: 20px, color #64748B
- **Text**: 
  - Font: Inter, Regular
  - Size: 0.875rem (14px)
  - Color: #0F172A

### 6. Interview Notes Card
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1.5rem (24px)
- **Margin Bottom**: 1.5rem (24px)

#### Textarea
- **Placeholder**: "Add notes here..."
- **Rows**: 6
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Padding**: 0.75rem
- **Resize**: vertical
- **Focus**: Border #3B82F6

#### Save Button
- **Text**: "Save Notes"
- **Background**: #3B82F6
- **Text Color**: White
- **Height**: 2.5rem (40px)
- **Padding**: 0.5rem 1.5rem
- **Border Radius**: 0.375rem (6px)
- **Margin Top**: 1rem (16px)

### 7. Feedback Card
- **Background**: White
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1.5rem (24px)

#### Feedback Item
- **Border Bottom**: 1px solid #E2E8F0
- **Padding**: 1rem (16px) vertical
- **Last Item**: No border

##### Rating
- **Stars**: ⭐ (filled) / ☆ (empty)
- **Size**: 1.25rem (20px)
- **Color**: #F59E0B (yellow)
- **Score**: "4.5/5"
  - Font: Inter, Semibold
  - Size: 1rem (16px)
  - Color: #0F172A

##### Author & Date
- **Format**: "Name - Date"
- **Font**: Inter, Medium
- **Size**: 0.875rem (14px)
- **Color**: #64748B
- **Margin**: 0.5rem (8px) vertical

##### Comment
- **Font**: Inter, Regular
- **Size**: 0.875rem (14px)
- **Color**: #0F172A
- **Line Height**: 1.5

## Responsive Behavior

### Desktop (>1024px)
- Max width: 1200px, centered
- Full layout

### Tablet (768px - 1024px)
- Reduce padding
- Stack action buttons on smaller screens

### Mobile (<768px)
- Single column
- Stack all elements vertically
- Full-width buttons
- Reduce font sizes

## Accessibility
- Keyboard navigation
- ARIA labels
- Focus states
- Screen reader support
