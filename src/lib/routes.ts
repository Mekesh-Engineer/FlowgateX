/**
 * Centralized routing configuration for FlowGateX
 * Maps user roles to their respective dashboard routes
 */

export type UserRole = 'guest' | 'user' | 'organizer' | 'admin';

/**
 * Dashboard home routes based on user role
 */
export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  guest: '/',
  user: '/dashboard/user',
  organizer: '/dashboard/organizer',
  admin: '/dashboard/admin',
};

/**
 * Public routes accessible without authentication
 */
export const PUBLIC_ROUTES = {
  // Landing & Info
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  
  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Events (Public View)
  EVENTS: '/events',
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  
  // Legal
  TERMS: '/terms',
  PRIVACY: '/privacy',
  REFUND_POLICY: '/refund-policy',
  
  // Error Pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;

/**
 * User/Attendee Dashboard Routes
 */
export const USER_ROUTES = {
  DASHBOARD: '/dashboard/user',
  
  // Events
  EVENTS_CATALOG: '/dashboard/user/events',
  SAVED_EVENTS: '/dashboard/user/saved-events',
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  
  // Bookings & Tickets
  BOOKINGS: '/dashboard/user/bookings',
  BOOKING_CREATE: (eventId: string) => `/booking/${eventId}`,
  PAYMENT: (bookingId: string) => `/payment/${bookingId}`,
  TICKET_VIEW: (ticketId: string) => `/ticket/${ticketId}`,
  
  // Account
  PROFILE: '/dashboard/user/profile',
  NOTIFICATIONS: '/dashboard/user/notifications',
} as const;

/**
 * Organizer Dashboard Routes
 */
export const ORGANIZER_ROUTES = {
  DASHBOARD: '/dashboard/organizer',
  
  // Event Management
  EVENTS: '/dashboard/organizer/events',
  CREATE_EVENT: '/dashboard/organizer/events/create',
  EDIT_EVENT: (id: string) => `/dashboard/organizer/events/${id}/edit`,
  EVENT_PARTICIPANTS: (id: string) => `/dashboard/organizer/events/${id}/participants`,
  CROWD_MONITORING: (id: string) => `/dashboard/organizer/events/${id}/crowd`,
  ACCESS_LOGS: (id: string) => `/dashboard/organizer/events/${id}/access-logs`,
  
  // Operations
  PARTICIPANTS: '/dashboard/organizer/participants',
  IOT: '/dashboard/organizer/iot',
  CROWD: '/dashboard/organizer/crowd',
  ANALYTICS: '/dashboard/organizer/analytics',
  REVENUE: '/dashboard/organizer/revenue',
  MARKETING: '/dashboard/organizer/marketing',
  
  // Account
  PROFILE: '/dashboard/organizer/profile',
} as const;

/**
 * Admin Dashboard Routes
 */
export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard/admin',
  
  // User Management
  USERS: '/dashboard/admin/users',
  ORGANIZERS: '/dashboard/admin/organizers',
  
  // Content & Events
  EVENTS: '/dashboard/admin/events',
  CONTENT: '/dashboard/admin/content',
  
  // Operations
  ANALYTICS: '/dashboard/admin/analytics',
  DEVICES: '/dashboard/admin/devices',
  PAYMENTS: '/dashboard/admin/payments',
  LOGS: '/dashboard/admin/logs',
  
  // System
  SUPPORT: '/dashboard/admin/support',
  CHATBOT: '/dashboard/admin/chatbot',
  SETTINGS: '/dashboard/admin/settings',
} as const;

/**
 * Get the default dashboard route for a given role
 */
export function getDashboardRoute(role: UserRole): string {
  return DASHBOARD_ROUTES[role] || DASHBOARD_ROUTES.guest;
}

/**
 * Check if a path is a public route
 */
export function isPublicRoute(path: string): boolean {
  const publicPaths = Object.values(PUBLIC_ROUTES).filter(
    (route) => typeof route === 'string'
  ) as string[];
  
  return publicPaths.some((publicPath) => 
    path === publicPath || path.startsWith('/events/')
  );
}

/**
 * Check if user has permission to access a route
 */
export function canAccessRoute(path: string, userRole: UserRole | null): boolean {
  // Public routes are always accessible
  if (isPublicRoute(path)) return true;
  
  // Not authenticated
  if (!userRole || userRole === 'guest') return false;
  
  // Role-based access
  if (path.startsWith('/dashboard/admin')) return userRole === 'admin';
  if (path.startsWith('/dashboard/organizer')) return ['organizer', 'admin'].includes(userRole);
  if (path.startsWith('/dashboard/user')) return ['user', 'organizer', 'admin'].includes(userRole);
  
  return false;
}

/**
 * Get redirect path for unauthorized access
 */
export function getRedirectPath(path: string, userRole: UserRole | null): string {
  // If trying to access dashboard without auth
  if (path.startsWith('/dashboard') && (!userRole || userRole === 'guest')) {
    return PUBLIC_ROUTES.LOGIN;
  }
  
  // If trying to access wrong role dashboard
  if (userRole && userRole !== 'guest') {
    return getDashboardRoute(userRole);
  }
  
  return PUBLIC_ROUTES.UNAUTHORIZED;
}
