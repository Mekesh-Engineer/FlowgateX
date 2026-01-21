export const APP_NAME = 'FlowGateX';
export const APP_DESCRIPTION = 'Enterprise Event Management Platform';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UNAUTHORIZED: '/unauthorized',
} as const;

export const ROLES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export const ITEMS_PER_PAGE = 10;
