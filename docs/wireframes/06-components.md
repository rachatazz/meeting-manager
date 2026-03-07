# Reusable Components Wireframe

## Overview
Detailed specifications for reusable UI components used across the application.

## 1. StatusBadge Component

### Purpose
Display meeting status with appropriate color coding.

### Props
- `status`: 'confirmed' | 'pending' | 'cancelled' | 'completed'

### Variants

#### Confirmed
- **Background**: #D1FAE5 (light green)
- **Text Color**: #065F46 (dark green)
- **Icon**: Check circle
- **Text**: "Confirmed"

#### Pending
- **Background**: #FEF3C7 (light yellow)
- **Text Color**: #92400E (dark yellow)
- **Icon**: Clock
- **Text**: "Pending"

#### Cancelled
- **Background**: #FEE2E2 (light red)
- **Text Color**: #991B1B (dark red)
- **Icon**: X circle
- **Text**: "Cancelled"

#### Completed
- **Background**: #DBEAFE (light blue)
- **Text Color**: #1E40AF (dark blue)
- **Icon**: Check
- **Text**: "Completed"

### Styling
- **Padding**: 0.25rem 0.75rem
- **Border Radius**: 9999px (full)
- **Font**: Inter, Medium
- **Size**: 0.75rem (12px)
- **Display**: Inline-flex, align center
- **Gap**: 0.25rem (4px)
- **Icon Size**: 14px

## 2. MeetingCard Component

### Purpose
Display meeting summary in list views.

### Props
- `meeting`: Meeting object
- `onView`: Function
- `onEdit`: Function
- `onCancel`: Function

### Structure
See Dashboard wireframe (03-dashboard-page.md) for detailed specs.

### Key Features
- Hover effect with shadow
- Status badge
- Action buttons
- Responsive layout

## 3. MeetingForm Component

### Purpose
Reusable form for creating/editing meetings.

### Props
- `meeting`: Meeting object (optional, for edit mode)
- `onSubmit`: Function
- `onCancel`: Function
- `mode`: 'create' | 'edit'

### Structure
See Booking Form wireframe (04-booking-form-page.md) for detailed specs.

### Key Features
- Validation
- Autocomplete for candidate name
- Conditional fields (online/onsite)
- Date/time pickers

## 4. FeedbackForm Component

### Purpose
Form for adding feedback/ratings.

### Layout
```
┌──────────────────────────────────────┐
│ Add Feedback                         │
│ ──────────────────────────────────── │
│                                      │
│ Rating *                             │
│ ⭐⭐⭐⭐⭐                             │
│                                      │
│ Comment *                            │
│ [_____________________________]      │
│ [                             ]      │
│ [                             ]      │
│                                      │
│ [Cancel]            [Submit]         │
└──────────────────────────────────────┘
```

### Components

#### Rating Input
- **Display**: 5 stars
- **Interactive**: Click to rate
- **Hover**: Highlight stars up to cursor
- **Selected**: Filled stars (#F59E0B)
- **Unselected**: Empty stars (#E2E8F0)
- **Size**: 2rem (32px)

#### Comment Textarea
- **Rows**: 4
- **Placeholder**: "Share your feedback..."
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Focus**: Border #3B82F6

#### Buttons
- **Cancel**: Gray, outlined
- **Submit**: Orange, filled

## 5. FeedbackList Component

### Purpose
Display list of feedback items.

### Props
- `feedbacks`: Array of feedback objects

### Layout
```
┌──────────────────────────────────────┐
│ ⭐⭐⭐⭐⭐ 4.5/5                      │
│ John Doe - Oct 12, 2025              │
│ "Strong technical skills and         │
│ problem-solving abilities..."        │
│ ──────────────────────────────────── │
│ ⭐⭐⭐⭐☆ 4.0/5                      │
│ Jane Smith - Oct 12, 2025            │
│ "Good communication..."              │
└──────────────────────────────────────┘
```

### Item Structure
- **Rating**: Stars + score
- **Author & Date**: Name - Date
- **Comment**: Text
- **Divider**: Between items

## 6. Button Component

### Purpose
Standardized button component.

### Variants

#### Primary
- **Background**: #F97316
- **Text**: White
- **Hover**: #EA580C

#### Secondary
- **Background**: #3B82F6
- **Text**: White
- **Hover**: #2563EB

#### Outline
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Text**: #64748B
- **Hover**: Background #F8FAFC

#### Danger
- **Background**: #EF4444
- **Text**: White
- **Hover**: #DC2626

#### Ghost
- **Background**: Transparent
- **Text**: #64748B
- **Hover**: Background #F8FAFC

### Sizes
- **sm**: Height 2rem (32px), padding 0.5rem 1rem, font 0.875rem
- **md**: Height 2.5rem (40px), padding 0.5rem 1.5rem, font 1rem
- **lg**: Height 3rem (48px), padding 0.75rem 2rem, font 1.125rem

### States
- **Default**: Normal appearance
- **Hover**: Darker background
- **Active**: Scale 0.98
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Loading**: Spinner icon, disabled

## 7. Input Component

### Purpose
Standardized input field.

### Types
- Text
- Email
- Password
- Number
- Date
- Time

### Styling
- **Height**: 2.5rem (40px)
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.375rem (6px)
- **Padding**: 0.5rem 0.75rem
- **Font**: Inter, Regular
- **Size**: 1rem (16px)
- **Focus**: Border #3B82F6, shadow-sm

### States
- **Default**: Gray border
- **Focus**: Blue border
- **Error**: Red border (#EF4444)
- **Disabled**: Opacity 0.5, gray background
- **Success**: Green border (#10B981)

### With Icon
- **Icon Position**: Left or right
- **Icon Size**: 20px
- **Icon Color**: #64748B
- **Padding Adjustment**: Add space for icon

## 8. Modal Component

### Purpose
Overlay dialog for confirmations and forms.

### Structure
```
┌─────────────────────────────────────┐
│ ███████████████████████████████████ │ ← Backdrop
│ ███┌───────────────────────────┐███ │
│ ███│ Modal Title           [×] │███ │
│ ███├───────────────────────────┤███ │
│ ███│                           │███ │
│ ███│ Modal Content             │███ │
│ ███│                           │███ │
│ ███├───────────────────────────┤███ │
│ ███│ [Cancel]        [Confirm] │███ │
│ ███└───────────────────────────┘███ │
│ ███████████████████████████████████ │
└─────────────────────────────────────┘
```

### Styling

#### Backdrop
- **Background**: rgba(0, 0, 0, 0.5)
- **Position**: Fixed, full screen
- **Z-index**: 1000

#### Modal Container
- **Background**: White
- **Border Radius**: 0.5rem (8px)
- **Shadow**: 0 20px 25px rgba(0, 0, 0, 0.15)
- **Max Width**: 500px
- **Padding**: 1.5rem (24px)
- **Position**: Centered

#### Header
- **Font**: Inter, Semibold
- **Size**: 1.25rem (20px)
- **Color**: #0F172A
- **Border Bottom**: 1px solid #E2E8F0
- **Padding Bottom**: 1rem (16px)

#### Close Button
- **Position**: Top right
- **Icon**: X
- **Size**: 24px
- **Color**: #64748B
- **Hover**: Color #0F172A

#### Content
- **Padding**: 1.5rem (24px) vertical
- **Font**: Inter, Regular
- **Size**: 0.875rem (14px)
- **Color**: #64748B

#### Footer
- **Border Top**: 1px solid #E2E8F0
- **Padding Top**: 1rem (16px)
- **Display**: Flex, justify end
- **Gap**: 0.75rem (12px)

### Animations
- **Enter**: Fade in + scale from 0.95
- **Exit**: Fade out + scale to 0.95
- **Duration**: 200ms

## 9. Toast Notification Component

### Purpose
Temporary notification messages.

### Variants

#### Success
- **Background**: #D1FAE5
- **Border**: 1px solid #10B981
- **Icon**: Check circle (#10B981)
- **Text**: #065F46

#### Error
- **Background**: #FEE2E2
- **Border**: 1px solid #EF4444
- **Icon**: X circle (#EF4444)
- **Text**: #991B1B

#### Warning
- **Background**: #FEF3C7
- **Border**: 1px solid #F59E0B
- **Icon**: Alert triangle (#F59E0B)
- **Text**: #92400E

#### Info
- **Background**: #DBEAFE
- **Border**: 1px solid #3B82F6
- **Icon**: Info circle (#3B82F6)
- **Text**: #1E40AF

### Styling
- **Position**: Fixed, top-right
- **Width**: 350px
- **Padding**: 1rem (16px)
- **Border Radius**: 0.5rem (8px)
- **Shadow**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **Display**: Flex, align center
- **Gap**: 0.75rem (12px)

### Behavior
- **Duration**: 3-5 seconds
- **Animation**: Slide in from right
- **Dismissible**: Click X to close
- **Stack**: Multiple toasts stack vertically

## 10. Loading Spinner Component

### Purpose
Indicate loading state.

### Variants

#### Small
- **Size**: 16px
- **Border**: 2px
- **Use**: Inside buttons

#### Medium
- **Size**: 24px
- **Border**: 3px
- **Use**: Inline loading

#### Large
- **Size**: 48px
- **Border**: 4px
- **Use**: Full page loading

### Styling
- **Border**: Solid, transparent
- **Border Top**: Colored (#F97316 or #3B82F6)
- **Border Radius**: 50%
- **Animation**: Spin 1s linear infinite

## Accessibility Notes
All components must include:
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader support
- Semantic HTML
