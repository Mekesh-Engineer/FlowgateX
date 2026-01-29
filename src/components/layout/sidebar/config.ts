/**
 * Sidebar Configuration
 * Role-based navigation configuration using centralized routes
 */

import { SidebarConfigType, UserRole } from './types';
import {
  PUBLIC_ROUTES,
  USER_ROUTES,
  ORGANIZER_ROUTES,
  ADMIN_ROUTES,
} from '@/lib/routes';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PaymentsIcon from '@mui/icons-material/Payments';
import PaymentIcon from '@mui/icons-material/Payment';
import CampaignIcon from '@mui/icons-material/Campaign';
import MemoryIcon from '@mui/icons-material/Memory';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

// ============================================================================
// Sidebar Configuration by Role
// ============================================================================

export const SIDEBAR_CONFIG: Record<UserRole, SidebarConfigType> = {
  // ---------------------------------------------------------------------------
  // GUEST (Unauthenticated)
  // ---------------------------------------------------------------------------
  guest: {
    showSearch: false,
    showQuickActions: false,
    showStats: false,
    showRoleHeader: false,
    sections: [
      {
        id: 'explore',
        label: 'Explore',
        items: [
          { id: 'events', label: 'Browse Events', path: PUBLIC_ROUTES.EVENTS, icon: EventIcon },
          { id: 'about', label: 'About Us', path: PUBLIC_ROUTES.ABOUT, icon: BusinessIcon },
          { id: 'help', label: 'Help Center', path: PUBLIC_ROUTES.HELP, icon: HelpOutlineIcon },
          { id: 'contact', label: 'Contact', path: PUBLIC_ROUTES.CONTACT, icon: ContactSupportIcon },
        ],
      },
    ],
    footer: [
      { id: 'login', label: 'Sign In', path: PUBLIC_ROUTES.LOGIN, icon: LoginIcon, highlight: true },
    ],
  },

  // ---------------------------------------------------------------------------
  // USER (Attendee)
  // ---------------------------------------------------------------------------
  user: {
    showSearch: true,
    searchPlaceholder: 'Search events...',
    showQuickActions: true,
    showStats: true,
    showRoleHeader: true,
    showQuickSettings: true,
    sections: [
      {
        id: 'main',
        label: 'Main',
        items: [
          { id: 'home', label: 'Dashboard', path: USER_ROUTES.DASHBOARD, icon: HomeIcon, exactMatch: true },
          { id: 'events', label: 'Browse Events', path: PUBLIC_ROUTES.EVENTS, icon: EventIcon },
          { id: 'bookings', label: 'My Bookings', path: USER_ROUTES.BOOKINGS, icon: ConfirmationNumberIcon, badge: 'upcomingBookings', badgeColor: 'blue' },
          { id: 'saved', label: 'Saved Events', path: USER_ROUTES.SAVED_EVENTS, icon: FavoriteBorderIcon, badge: 'savedCount', badgeColor: 'pink' },
          { id: 'profile', label: 'Profile', path: USER_ROUTES.PROFILE, icon: PersonIcon },
          { id: 'notifications', label: 'Notifications', path: USER_ROUTES.NOTIFICATIONS, icon: NotificationsIcon, badge: 'unreadNotifications', badgeColor: 'red' },
          { id: 'help', label: 'Help', path: PUBLIC_ROUTES.HELP, icon: HelpOutlineIcon },
        ],
      },
    ],
    quickActions: [
      { id: 'find-events', label: 'Find Events', action: 'navigate', path: PUBLIC_ROUTES.EVENTS, icon: SearchIcon, variant: 'primary' },
      { id: 'view-tickets', label: 'My Tickets', action: 'navigate', path: USER_ROUTES.BOOKINGS, icon: ConfirmationNumberIcon },
    ],
    footer: [
      { id: 'logout', label: 'Sign Out', path: '#', icon: LogoutIcon, action: 'logout', variant: 'danger' },
    ],
  },

  // ---------------------------------------------------------------------------
  // ORGANIZER
  // ---------------------------------------------------------------------------
  organizer: {
    showSearch: true,
    searchPlaceholder: 'Search my events...',
    showQuickActions: true,
    showStats: true,
    showRoleHeader: true,
    sections: [
      {
        id: 'main',
        label: 'Main',
        items: [
          { id: 'dashboard', label: 'Dashboard', path: ORGANIZER_ROUTES.DASHBOARD, icon: DashboardIcon, exactMatch: true },
          { id: 'create-event', label: 'Create Event', path: ORGANIZER_ROUTES.CREATE_EVENT, icon: AddCircleOutlineIcon, variant: 'gradient' },
          { id: 'events', label: 'My Events', path: ORGANIZER_ROUTES.EVENTS, icon: EventNoteIcon },
          { id: 'participants', label: 'Participants', path: ORGANIZER_ROUTES.PARTICIPANTS, icon: PeopleIcon },
          { id: 'iot', label: 'IoT Management', path: ORGANIZER_ROUTES.IOT, icon: MemoryIcon },
          { id: 'crowd', label: 'Crowd Monitoring', path: ORGANIZER_ROUTES.CROWD, icon: GroupsIcon },
          { id: 'analytics', label: 'Analytics', path: ORGANIZER_ROUTES.ANALYTICS, icon: AnalyticsIcon },
          { id: 'revenue', label: 'Revenue', path: ORGANIZER_ROUTES.REVENUE, icon: PaymentsIcon },
          { id: 'marketing', label: 'Marketing', path: ORGANIZER_ROUTES.MARKETING, icon: CampaignIcon },
          { id: 'profile', label: 'Profile', path: ORGANIZER_ROUTES.PROFILE, icon: AccountCircleIcon },
        ],
      },
    ],
    quickActions: [
      { id: 'create-event-quick', label: 'Create Event', action: 'navigate', path: ORGANIZER_ROUTES.CREATE_EVENT, icon: AddCircleIcon, variant: 'gradient' },
      { id: 'view-analytics', label: 'Analytics', action: 'navigate', path: ORGANIZER_ROUTES.ANALYTICS, icon: AnalyticsIcon },
    ],
    footer: [
      { id: 'logout', label: 'Sign Out', path: '#', icon: LogoutIcon, action: 'logout', variant: 'danger' },
    ],
  },

  // ---------------------------------------------------------------------------
  // ADMIN
  // ---------------------------------------------------------------------------
  admin: {
    showSearch: true,
    searchPlaceholder: 'Search system...',
    showQuickActions: true,
    showStats: true,
    showRoleHeader: true,
    sections: [
      {
        id: 'main',
        label: 'Administration',
        items: [
          { id: 'dashboard', label: 'Platform Dashboard', path: ADMIN_ROUTES.DASHBOARD, icon: DashboardIcon, exactMatch: true },
          { id: 'users', label: 'User Management', path: ADMIN_ROUTES.USERS, icon: PeopleOutlineIcon },
          { id: 'organizers', label: 'Organizers', path: ADMIN_ROUTES.ORGANIZERS, icon: BusinessCenterIcon },
          { id: 'events', label: 'Event Moderation', path: ADMIN_ROUTES.EVENTS, icon: EventIcon },
          { id: 'analytics', label: 'Platform Analytics', path: ADMIN_ROUTES.ANALYTICS, icon: AnalyticsIcon },
          { id: 'devices', label: 'Device Management', path: ADMIN_ROUTES.DEVICES, icon: DevicesIcon },
          { id: 'payments', label: 'Payments', path: ADMIN_ROUTES.PAYMENTS, icon: PaymentIcon },
          { id: 'support', label: 'Support Tickets', path: ADMIN_ROUTES.SUPPORT, icon: SupportAgentIcon },
          { id: 'content', label: 'Content Management', path: ADMIN_ROUTES.CONTENT, icon: ArticleIcon },
          { id: 'settings', label: 'System Settings', path: ADMIN_ROUTES.SETTINGS, icon: SettingsIcon },
          { id: 'logs', label: 'Audit Logs', path: ADMIN_ROUTES.LOGS, icon: DescriptionIcon },
          { id: 'chatbot', label: 'Chatbot Management', path: ADMIN_ROUTES.CHATBOT, icon: SmartToyIcon },
        ],
      },
    ],
    quickActions: [
      { id: 'view-analytics', label: 'Analytics', action: 'navigate', path: ADMIN_ROUTES.ANALYTICS, icon: AnalyticsIcon, variant: 'primary' },
      { id: 'view-support', label: 'Support', action: 'navigate', path: ADMIN_ROUTES.SUPPORT, icon: SupportAgentIcon },
    ],
    footer: [
      { id: 'logout', label: 'Sign Out', path: '#', icon: LogoutIcon, action: 'logout', variant: 'danger' },
    ],
  },
};

/**
 * Get sidebar configuration for a given role
 */
export function getSidebarConfig(role: UserRole): SidebarConfigType {
  return SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG.guest;
}
