import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { UserRole } from '@/lib/constants';

// =============================================================================
// ROLE-BASED ROUTING CONFIGURATION
// =============================================================================
// Routes organized by user role and access level:
// - User/Attendee: Basic event browsing and ticket management
// - Organizer: Event creation, management, and analytics
// - Admin: System administration and user management
// - Super Admin: Complete system control with advanced features
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC PAGES (No authentication required)
// ─────────────────────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGES (Unauthenticated users only)
// ─────────────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// ─────────────────────────────────────────────────────────────────────────────
// EVENT PAGES (Mixed access levels)
// ─────────────────────────────────────────────────────────────────────────────
const EventsPage = lazy(() => import('@/pages/events/EventsPage'));
const EventDetailsPage = lazy(() => import('@/pages/events/EventDetailsPage'));
const CreateEventPage = lazy(() => import('@/pages/events/CreateEventPage'));
const ManageEventPage = lazy(() => import('@/pages/events/ManageEventPage'));

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING PAGES (Authenticated users)
// ─────────────────────────────────────────────────────────────────────────────
const CheckoutPage = lazy(() => import('@/pages/booking/CheckoutPage'));
const BookingSuccessPage = lazy(() => import('@/pages/booking/BookingSuccessPage'));

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGES (Role-specific)
// ─────────────────────────────────────────────────────────────────────────────
const UserDashboard = lazy(() => import('@/pages/dashboard/Attendee/UserDashboard'));
const OrganizerDashboard = lazy(() => import('@/pages/dashboard/Organizer/OrganizerDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/Admin/AdminDashboard'));

// ─────────────────────────────────────────────────────────────────────────────
// COMMON AUTH PAGES (Protected)
// ─────────────────────────────────────────────────────────────────────────────
const UserProfile = lazy(() => import('@/pages/common/UserProfile'));
const SupportPage = lazy(() => import('@/pages/common/SupportPage'));

// ─────────────────────────────────────────────────────────────────────────────
// ERROR PAGES
// ─────────────────────────────────────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  requiresAuth?: boolean;
  roles?: UserRole[];
  children?: AppRoute[];
  description?: string;
  feature?: string;
}

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// Access: Everyone
// =============================================================================
export const publicRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/events/:id', element: <EventDetailsPage /> },
];

// =============================================================================
// AUTH ROUTES (Unauthenticated only - redirect if already logged in)
// Access: Guest users
// =============================================================================
export const authRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
];

// =============================================================================
// USER/ATTENDEE ROUTES (Basic authenticated access)
// Access: All authenticated users (user, organizer, admin, superadmin)
// Features:
// - Personal dashboard with ticket overview
// - Booking and checkout process
// - Profile management
// - Ticket history and QR codes
// =============================================================================
export const protectedRoutes: RouteObject[] = [
  { path: '/dashboard', element: <UserDashboard /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/booking/success', element: <BookingSuccessPage /> },
  
  // Common Protected Routes
  { path: '/profile', element: <UserProfile /> },
  { path: '/support', element: <SupportPage /> },
  
  // Additional user routes can be added here:
  // { path: '/tickets', element: <MyTicketsPage /> },
  // { path: '/tickets/:id', element: <TicketDetailsPage /> },
  // { path: '/wallet', element: <DigitalWalletPage /> },
  // { path: '/settings', element: <UserSettingsPage /> },
];

// =============================================================================
// ORGANIZER ROUTES (Event management and analytics)
// Access: Organizer, Admin, Super Admin
// Features:
// - Create and manage events
// - Attendees list and check-in control
// - Event analytics and reports
// - IoT device management
// - Communication and notifications
// - Ticket sales management
// =============================================================================
export const organizerRoutes: RouteObject[] = [
  // Main organizer dashboard
  { path: '/organizer', element: <OrganizerDashboard /> },
  
  // Event management
  { path: '/organizer/events/create', element: <CreateEventPage /> },
  { path: '/organizer/events/:id/manage', element: <ManageEventPage /> },
  // { path: '/organizer/events/:id/edit', element: <EditEventPage /> },
  // { path: '/organizer/events/:id/analytics', element: <EventAnalyticsPage /> },
  // { path: '/organizer/events/:id/attendees', element: <AttendeeListPage /> },
  // { path: '/organizer/events/:id/check-in', element: <CheckInPage /> },
  
  // Additional organizer features (uncomment when pages are ready):
  // { path: '/organizer/analytics', element: <OrganizerAnalyticsPage /> },
  // { path: '/organizer/payments', element: <PaymentsDashboardPage /> },
  // { path: '/organizer/iot-devices', element: <IoTManagementPage /> },
  // { path: '/organizer/communications', element: <CommunicationsPage /> },
  // { path: '/organizer/reports', element: <ReportsPage /> },
  // { path: '/organizer/settings', element: <OrganizerSettingsPage /> },
];

// =============================================================================
// ADMIN ROUTES (System administration)
// Access: Admin, Super Admin
// Features:
// - User and role management
// - System health monitoring
// - Platform-wide analytics
// - Content moderation
// - Support ticket management
// - Security and audit logs
// =============================================================================
export const adminRoutes: RouteObject[] = [
  // Main admin dashboard
  { path: '/admin', element: <AdminDashboard /> },
  
  // Additional admin features (uncomment when pages are ready):
  // { path: '/admin/users', element: <UserManagementPage /> },
  // { path: '/admin/users/:id', element: <UserDetailsPage /> },
  // { path: '/admin/roles', element: <RoleManagementPage /> },
  // { path: '/admin/events', element: <AllEventsPage /> },
  // { path: '/admin/analytics', element: <PlatformAnalyticsPage /> },
  // { path: '/admin/system-health', element: <SystemHealthPage /> },
  // { path: '/admin/payments', element: <PaymentMonitoringPage /> },
  // { path: '/admin/reports', element: <AdminReportsPage /> },
  // { path: '/admin/audit-logs', element: <AuditLogsPage /> },
  // { path: '/admin/settings', element: <SystemSettingsPage /> },
  // { path: '/admin/support', element: <SupportTicketsPage /> },
];

// =============================================================================
// SUPER ADMIN ROUTES (Complete system control)
// Access: Super Admin only
// Features:
// - Advanced system configuration
// - Database management
// - API key management
// - Global settings and permissions
// - Advanced security controls
// - System backups and maintenance
// =============================================================================
export const superAdminRoutes: RouteObject[] = [
  // Additional super admin features (uncomment when pages are ready):
  // { path: '/superadmin', element: <SuperAdminDashboard /> },
  // { path: '/superadmin/system-config', element: <SystemConfigPage /> },
  // { path: '/superadmin/database', element: <DatabaseManagementPage /> },
  // { path: '/superadmin/api-keys', element: <ApiKeyManagementPage /> },
  // { path: '/superadmin/permissions', element: <GlobalPermissionsPage /> },
  // { path: '/superadmin/security', element: <SecurityControlsPage /> },
  // { path: '/superadmin/backups', element: <BackupManagementPage /> },
  // { path: '/superadmin/logs', element: <SystemLogsPage /> },
  // { path: '/superadmin/maintenance', element: <MaintenanceModePage /> },
];

// =============================================================================
// ERROR & FALLBACK ROUTES
// =============================================================================
export const fallbackRoute: RouteObject = {
  path: '*',
  element: <NotFoundPage />,
};

// =============================================================================
// ROLE-BASED ROUTE MAPPING
// Used for dynamic navigation and access control
// =============================================================================
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  [UserRole.USER]: '/dashboard',
  [UserRole.ORGANIZER]: '/organizer',
  [UserRole.ADMIN]: '/admin',
  [UserRole.SUPER_ADMIN]: '/admin', // Super admin uses admin dashboard with additional features
};

// Export defaults
export default {
  publicRoutes,
  authRoutes,
  protectedRoutes,
  organizerRoutes,
  adminRoutes,
  superAdminRoutes,
  fallbackRoute,
  ROLE_DASHBOARDS,
};
