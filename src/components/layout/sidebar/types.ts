/**
 * Sidebar Types & Interfaces
 * Shared type definitions for the sidebar component system
 */

import { SvgIconComponent } from '@mui/icons-material';

// ============================================================================
// User & Role Types
// ============================================================================

export type UserRole = 'guest' | 'user' | 'organizer' | 'admin';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  organization?: string;
  firstName?: string;
  lastName?: string;
}

// ============================================================================
// Sidebar Item Types
// ============================================================================

export interface SidebarItemType {
  id: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
  exactMatch?: boolean;
  highlight?: boolean;
  badge?: string;
  badgeColor?: 'red' | 'blue' | 'green' | 'pink' | 'orange';
  subItems?: SidebarItemType[];
  action?: 'navigate' | 'modal' | 'logout';
  variant?: 'primary' | 'default' | 'gradient' | 'danger';
}

export interface SidebarSectionType {
  id: string;
  label: string;
  items: SidebarItemType[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface SidebarConfigType {
  showSearch: boolean;
  searchPlaceholder?: string;
  showQuickActions: boolean;
  showStats: boolean;
  showRoleHeader: boolean;
  showQuickSettings?: boolean;
  sections: SidebarSectionType[];
  quickActions?: SidebarItemType[];
  footer: SidebarItemType[];
}

// ============================================================================
// Widget Types
// ============================================================================

export interface IoTDeviceStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
}

export interface SystemHealth {
  uptime: string;
  activeUsers: number;
  liveEvents: number;
  paymentIssues: number;
  offlineDevices: number;
}

export interface BadgeCounts {
  upcomingBookings: number;
  savedCount: number;
  unreadNotifications: number;
  activeEvents: number;
  [key: string]: number;
}

// ============================================================================
// Component Props
// ============================================================================

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface SidebarItemProps {
  item: SidebarItemType;
  badges: BadgeCounts;
  isActive: boolean;
  onItemClick?: () => void;
  isCollapsed: boolean;
  onExpand: () => void;
}

export interface RoleHeaderProps {
  role: UserRole;
  userProfile: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface WidgetProps {
  isCollapsed: boolean;
}

export interface SearchBarProps {
  placeholder?: string;
  isCollapsed: boolean;
  onExpand: () => void;
}

export interface StatsWidgetProps {
  badges: BadgeCounts;
  isCollapsed: boolean;
}
