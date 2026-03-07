export const USER_ROLES = ['recruiter', 'interviewer', 'admin'] as const;

export const MEETING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;

export const MEETING_TYPES = ['online', 'onsite'] as const;

export const MEETING_PLATFORMS = ['zoom', 'google-meet', 'teams', 'webex', 'other'] as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const JWT_CONFIG = {
  ACCESS_EXPIRES_IN: '15m',
  REFRESH_EXPIRES_IN: '7d',
} as const;
