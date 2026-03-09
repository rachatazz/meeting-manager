# Register Page Wireframe

## Page Overview
User registration page for creating new accounts in the Meeting Manager system.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [CENTERED LAYOUT]                    │
│                                                         │
│              ┌─────────────────────────┐               │
│              │                         │               │
│              │    [COMPANY LOGO]       │               │
│              │                         │               │
│              │  Create Account         │               │
│              │  Join our team          │               │
│              │                         │               │
│              ├─────────────────────────┤               │
│              │                         │               │
│              │  Full Name              │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  Email                  │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  Password               │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  Confirm Password       │               │
│              │  [___________________]  │               │
│              │                         │               │
│              │  Role                   │               │
│              │  [▼ Select Role ______] │               │
│              │                         │               │
│              │  [ Register Button ]    │               │
│              │                         │               │
│              │  Already have account?  │               │
│              │  Login                  │               │
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
- **Main Title**: "Create Account"
  - Font: Inter, Bold
  - Size: 1.5rem (24px)
  - Color: #0F172A (Dark Navy)
  - Alignment: Center
  
- **Subtitle**: "Join our team"
  - Font: Inter, Regular
  - Size: 0.875rem (14px)
  - Color: #64748B (Medium Gray)
  - Alignment: Center
  - Margin Bottom: 2rem (32px)

### 4. Full Name Input Field
- **Label**: "Full Name"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Input**:
  - Type: text
  - Placeholder: "John Doe"
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Focus State: Border color #3B82F6, shadow-sm
  - Margin Bottom: 1rem (16px)

### 5. Email Input Field
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

### 6. Password Input Field
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
  - Margin Bottom: 1rem (16px)

- **Password Strength Indicator**:
  - Progress bar below input
  - Colors: Red (weak) → Yellow (medium) → Green (strong)
  - Height: 4px
  - Border Radius: 2px

### 7. Confirm Password Input Field
- **Label**: "Confirm Password"
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
  - Margin Bottom: 1rem (16px)

### 8. Role Dropdown
- **Label**: "Role"
  - Font: Inter, Medium
  - Size: 0.875rem (14px)
  - Color: #0F172A
  - Margin Bottom: 0.5rem (8px)

- **Dropdown**:
  - Placeholder: "Select Role"
  - Options:
    - Recruiter (default)
    - Interviewer
  - State: Disabled (role is pre-selected as Recruiter; admin role is assigned separately)
  - Height: 2.5rem (40px)
  - Border: 1px solid #E2E8F0
  - Border Radius: 0.375rem (6px)
  - Padding: 0.5rem 0.75rem
  - Icon: Chevron down
  - Margin Bottom: 1.5rem (24px)

### 9. Register Button
- **Text**: "Create Account"
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
- **Margin Bottom**: 1rem (16px)

### 10. Login Link
- **Text**: "Already have an account? Login"
- **Alignment**: Center
- **Font**: Inter, Regular
- **Size**: 0.875rem (14px)
- **Color**: #64748B
- **Link Color**: #3B82F6 (Secondary Blue)
- **Link Hover**: Underline

## States & Interactions

### Loading State
- Button shows spinner icon
- Button text: "Creating account..."
- All inputs disabled

### Error State
- Red border on invalid input (#EF4444)
- Error message below input in red
- Font size: 0.75rem (12px)
- Examples:
  - "Email already exists"
  - "Passwords do not match"
  - "Password must be at least 8 characters"

### Success State
- Redirect to login or dashboard
- Success toast: "Account created successfully!"

## Validation Rules
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Confirm Password**: Required, must match password
- **Role**: Defaults to Recruiter (dropdown disabled)

## Real-time Validation
- Email: Check format on blur
- Password: Show strength indicator on input
- Confirm Password: Check match on input
- Show validation icons (✓ or ✗) next to fields

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
- Tab order: Name → Email → Password → Confirm → Role → Register → Login
- ARIA labels for icons and dropdown
- Focus visible states
- Keyboard navigation support
- Screen reader friendly error messages
- Password visibility toggle accessible
