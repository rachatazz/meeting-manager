# Login Page Wireframe

## Page Overview

Authentication page for users to log into the Meeting Manager system.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [CENTERED LAYOUT]                    │
│                                                         │
│              ┌─────────────────────────┐               │
│              │                         │               │
│              │    [COMPANY LOGO]       │               │
│              │    (icon/image)     │               │
│              │                         │               │
│              │  Meeting Manager        │               │
│              │  Candidate Scheduler    │               │
│              │                         │               │
│              ├─────────────────────────┤               │
│              │                         │               │
│              │  Email                  │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  Password               │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  [ Login Button ]       │               │
│              │                         │               │
│              │  ─────── or ───────     │               │
│              │                         │               │
│              │  [ Continue as Guest ]  │               │
│              │                         │               │
│              │  Don't have account?    │               │
│              │  Register               │               │
│              │                         │               │
│              └─────────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Container Card

- **Width**: 400px max-width
- **Background**: White (#FFFFFF)
- **Border**: 1px solid #E2E8F0
- **Border Radius**: 0.5rem (8px)
- **Shadow**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **Padding**: 2rem (32px)
- **Position**: Centered vertically and horizontally

### 2. Logo Section

- **Logo**: Company icon/image
- **Size**: 64px × 64px
- **Margin Bottom**: 1.5rem (24px)
- **Alignment**: Center

### 3. Title Section

- **Main Title**: "Meeting Manager"
  - Font: Inter, Bold
  - Size: 1.5rem (24px)
  - Color: #0F172A (Dark Navy)
  - Alignment: Center
- **Subtitle**: "Candidate Scheduler"
  - Font: Inter, Regular
  - Size: 0.875rem (14px)
  - Color: #64748B (Medium Gray)
  - Alignment: Center
  - Margin Bottom: 2rem (32px)

### 4. Email Input Field

- **Label**: "Email"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: email
  - Placeholder: "your.email@company.com"
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Focus State: Border color #3B82F6, shadow-sm
  - Margin Bottom: 1rem (16px)

### 5. Password Input Field

- **Label**: "Password"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: password
  - Placeholder: "••••••••"
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Eye icon (toggle visibility)
  - Focus State: Border color #3B82F6, shadow-sm
  - Margin Bottom: 1.5rem (24px)

### 6. Login Button

- **Text**: "Login"
- **Width**: 100%
- **Height**: 2.5rem (40px)
- **Background**: #F97316 (Primary Orange)
- **Text Color**: #FFFFFF
- **Font**: Inter, Medium
- **Size**: 1rem (16px)
- **Border Radius**: 0.375rem (6px)
- **Hover State**: Background #EA580C (darker orange)
- **Active State**: Scale 0.98
- **Disabled State**: Opacity 0.5, cursor not-allowed
- **Margin Bottom**: 1.5rem (24px)

### 7. Divider

- **Text**: "or"
- **Style**: Horizontal line with centered text
- **Color**: #E2E8F0
- **Margin**: 1.5rem (24px) vertical

### 8. Guest Button

- **Text**: "Continue as Guest"
- **Width**: 100%
- **Height**: 2.5rem (40px)
- **Background**: Transparent
- **Border**: 1px solid #E2E8F0
- **Text Color**: #64748B
- **Font**: Inter, Medium
- **Size**: 1rem (16px)
- **Border Radius**: 0.375rem (6px)
- **Hover State**: Background #F8FAFC
- **Margin Bottom**: 1rem (16px)

### 9. Register Link

- **Text**: "Don't have an account? Register"
- **Alignment**: Center
- **Font**: Inter, Regular
- **Size**: 0.875rem (14px)
- **Color**: #64748B
- **Link Color**: #3B82F6 (Secondary Blue)
- **Link Hover**: Underline

## States & Interactions

### Loading State

- Button shows spinner icon
- Button text: "Logging in..."
- Inputs disabled

### Error State

- Red border on invalid input (#EF4444)
- Error message below input in red
- Font size: 0.75rem (12px)

### Success State

- Redirect to dashboard
- Optional: Success toast notification

## Validation Rules

- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

## Responsive Behavior

### Desktop (>768px)

- Card width: 400px
- Full layout as described

### Tablet (768px)

- Card width: 90%
- Max-width: 400px

### Mobile (<640px)

- Card width: 100%
- Padding: 1.5rem (24px)
- Remove card shadow on mobile
- Full-width layout

## Accessibility

- All inputs have labels
- Tab order: Email → Password → Login → Guest → Register
- ARIA labels for icons
- Focus visible states
- Keyboard navigation support
- Screen reader friendly error messages
