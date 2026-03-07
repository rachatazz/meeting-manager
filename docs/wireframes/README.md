# Meeting Manager - Wireframes Documentation

## Overview

This directory contains detailed wireframe specifications for the Meeting Manager application, including UX/UI design, component specifications, and interaction patterns.

### Theme Colors

- **Primary**: Orange (#F97316) - CTAs, highlights
- **Secondary**: Blue (#3B82F6) - Links, secondary actions
- **Dark**: Navy (#0F172A) - Text, headers
- **Neutral**: Grays (#F8FAFC, #64748B, #E2E8F0)

See `00-theme-colors.md` for complete design system.

## Wireframe Files

### Pages

1. **[00-theme-colors.md](./00-theme-colors.md)** - Design system, colors, typography, spacing
2. **[01-login-page.md](./01-login-page.md)** - Authentication page
3. **[02-register-page.md](./02-register-page.md)** - User registration page
4. **[03-dashboard-page.md](./03-dashboard-page.md)** - Main dashboard with meeting list
5. **[04-booking-form-page.md](./04-booking-form-page.md)** - Schedule new meeting form
6. **[05-candidate-summary-page.md](./05-candidate-summary-page.md)** - Meeting details and feedback
7. **[06-components.md](./06-components.md)** - Reusable component specifications

## Key Features

### User Experience

- **Clean & Modern**: Minimalist design with clear visual hierarchy
- **Responsive**: Mobile-first approach, works on all devices
- **Accessible**: WCAG 2.1 compliant, keyboard navigation, screen reader support
- **Intuitive**: Clear labels, helpful placeholders, real-time validation

### Visual Design

- **Color-Coded Status**: Green (Confirmed), Yellow (Pending), Red (Cancelled), Blue (Completed)
- **Consistent Spacing**: 8px grid system
- **Smooth Interactions**: Hover effects, transitions, animations
- **Clear Typography**: Inter font family, clear hierarchy

### Components

- **StatusBadge**: Color-coded meeting status indicators
- **MeetingCard**: Meeting summary cards with actions
- **MeetingForm**: Reusable create/edit form
- **FeedbackForm**: Rating and comment submission
- **FeedbackList**: Display feedback items
- **Modal**: Confirmation dialogs
- **Toast**: Notification messages
- **Button**: Multiple variants and sizes
- **Input**: Standardized form inputs

## Navigation Flow

```
Login/Register
    ↓
Dashboard (Meeting List)
    ↓
    ├─→ Schedule New Meeting → Booking Form
    ├─→ View Meeting Details → Candidate Summary
    │       ↓
    │       ├─→ Edit Meeting → Booking Form (Edit Mode)
    │       ├─→ Add Feedback → Feedback Form
    │       └─→ Cancel Meeting → Confirmation Modal
    └─→ Logout → Login
```

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Implementation Notes

### Technology Stack

- **Framework**: Nuxt 4 + Vue 3
- **UI Library**: PrimeVue (Aura theme)
- **Styling**: TailwindCSS
- **Icons**: PrimeIcons
- **State**: Pinia

### Component Mapping

- PrimeVue components used:
  - `Button` → Primary, Secondary, Outline variants
  - `InputText` → Text inputs
  - `Calendar` → Date picker
  - `Dropdown` → Select dropdowns
  - `Textarea` → Multi-line text
  - `Tag` → Status badges
  - `DataTable` → Meeting list (Dashboard)
  - `Dialog` → Modals
  - `Toast` → Notifications
  - `Rating` → Star ratings
  - `AutoComplete` → Candidate search

### Accessibility Checklist

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels for icons
- [ ] Screen reader tested
- [ ] Error messages are descriptive

## Design Principles

1. **Consistency**: Use design system throughout
2. **Clarity**: Clear labels and instructions
3. **Feedback**: Immediate response to user actions
4. **Efficiency**: Minimize clicks to complete tasks
5. **Forgiveness**: Easy to undo/cancel actions
6. **Accessibility**: Usable by everyone

## Next Steps

1. Review wireframes with stakeholders
2. Create high-fidelity mockups (optional)
3. Implement components following specifications
4. Conduct usability testing
5. Iterate based on feedback

## References

- [PrimeVue Documentation](https://primevue.org) - Component library
- [TailwindCSS](https://tailwindcss.com) - Utility classes
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
