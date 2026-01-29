'use client';

import React, { useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Auth Provider
import { useAuth } from '@/providers/auth-provider';

// Types & Config
import { SidebarProps, UserRole, UserProfile, BadgeCounts, SidebarItemType } from './types';
import { getSidebarConfig } from './config';

// Components
import { SidebarItem } from './sidebar-item';
import {
  RoleHeader,
  SidebarTooltip,
  EventSwitcher,
  IoTStatusWidget,
  SystemHealthWidget,
  SearchBar,
  StatsWidget,
  QuickSettingsWidget,
  SystemInfoFooter,
} from './widgets';

// MUI Icons
import BoltIcon from '@mui/icons-material/Bolt';

// ============================================================================
// Main Sidebar Component
// ============================================================================

/**
 * Unified Sidebar Component
 * 
 * Features:
 * - Role-based navigation configuration
 * - MUI icon components for consistency
 * - Integration with useAuth for user data
 * - Logout functionality for authenticated users
 * - OrganizerContext integration for event/IoT data
 * - Extracted widgets for maintainability
 */
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get user from auth context
  const { user, loading, logout } = useAuth();

  // Determine user role from auth
  const userRole: UserRole = useMemo(() => {
    if (loading || !user) return 'guest';
    return (user.role as UserRole) || 'user';
  }, [user, loading]);

  // Build user profile from auth data
  const userProfile: UserProfile = useMemo(() => ({
    id: user?.id || '',
    name: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    firstName: user?.firstName,
    lastName: user?.lastName,
    // Organization would come from organizer profile if available
    organization: undefined,
  }), [user]);

  // Get role-based configuration
  const config = useMemo(() => getSidebarConfig(userRole), [userRole]);

  // Badge counts - TODO: Integrate with real data from Redux/API
  const badges: BadgeCounts = useMemo(() => ({
    upcomingBookings: 3,
    savedCount: 12,
    unreadNotifications: 5,
    activeEvents: 2,
  }), []);

  // Check if a path is active
  const isActivePath = useCallback((itemPath: string, exactMatch = false) => {
    if (exactMatch) return pathname === itemPath;
    return pathname.startsWith(itemPath);
  }, [pathname]);

  // Handle navigation and special actions
  const handleAction = useCallback(async (item: SidebarItemType) => {
    // Handle logout action
    if (item.action === 'logout') {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
      return;
    }

    // Handle navigation
    if (item.path && item.path !== '#') {
      router.push(item.path);
      onClose?.();
    }
  }, [logout, router, onClose]);

  // Handle sidebar item click (for closing mobile sidebar)
  const handleItemClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handle logout specifically
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, router]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-300 ease-out lg:hidden',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '300px' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={clsx(
          'fixed left-0 top-0 h-screen bg-[var(--bg-card)] border-r border-[var(--border-primary)] flex flex-col z-40',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
          'transition-transform duration-300 ease-out lg:transition-none'
        )}
      >
        {/* Role-specific Header */}
        {config.showRoleHeader && userRole !== 'guest' && (
          <RoleHeader
            role={userRole}
            userProfile={userProfile}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
          />
        )}

        {/* Event Switcher (Organizer only) */}
        {userRole === 'organizer' && <EventSwitcher isCollapsed={isCollapsed} />}

        {/* System Health (Admin only) */}
        {userRole === 'admin' && <SystemHealthWidget isCollapsed={isCollapsed} />}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Search */}
          {config.showSearch && (
            <SearchBar
              placeholder={config.searchPlaceholder}
              isCollapsed={isCollapsed}
              onExpand={onToggleCollapse}
            />
          )}

          {/* Stats (User only) */}
          {config.showStats && userRole === 'user' && (
            <StatsWidget badges={badges} isCollapsed={isCollapsed} />
          )}

          {/* Navigation Sections */}
          <div className="space-y-6">
            {config.sections.map((section) => (
              <div key={section.id}>
                {/* Section Label */}
                <div className={clsx('mb-2 flex items-center px-4', isCollapsed ? 'justify-center' : '')}>
                  <span className={clsx(
                    'whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-all',
                    isCollapsed ? 'hidden' : 'block'
                  )}>
                    {section.label}
                  </span>
                  {isCollapsed && (
                    <div className="h-0.5 w-4 rounded-full bg-[var(--border-primary)]" />
                  )}
                </div>

                {/* Section Items */}
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      badges={badges}
                      isActive={isActivePath(item.path, item.exactMatch)}
                      onItemClick={
                        item.action === 'logout' 
                          ? handleLogout 
                          : handleItemClick
                      }
                      isCollapsed={isCollapsed}
                      onExpand={onToggleCollapse}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {config.showQuickActions && config.quickActions && (
            <div className="mx-3 mt-6 border-t border-[var(--border-primary)] pt-4">
              {!isCollapsed && (
                <p className="mb-2 flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  <BoltIcon sx={{ fontSize: 12 }} className="text-[var(--primary)]" /> 
                  Quick Actions
                </p>
              )}
              <div className="grid gap-2">
                {config.quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      className={clsx(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                        action.variant === 'primary'
                          ? 'bg-[var(--primary)] text-white hover:opacity-90'
                          : action.variant === 'gradient'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                          : 'border border-transparent text-[var(--text-secondary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-hover)]',
                        isCollapsed ? 'mx-auto w-10 justify-center px-0' : ''
                      )}
                    >
                      <ActionIcon sx={{ fontSize: 18 }} className={clsx(!isCollapsed && 'opacity-80')} />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{action.label}</span>
                      )}
                      {isCollapsed && <SidebarTooltip text={action.label} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* IoT Status (Organizer only) */}
        {userRole === 'organizer' && <IoTStatusWidget isCollapsed={isCollapsed} />}

        {/* Quick Settings (User only) */}
        {userRole === 'user' && config.showQuickSettings && (
          <QuickSettingsWidget isCollapsed={isCollapsed} />
        )}

        {/* System Info (Admin only) */}
        {userRole === 'admin' && <SystemInfoFooter isCollapsed={isCollapsed} />}

        {/* Footer (Guest login, Authenticated logout) */}
        {config.footer.length > 0 && (
          <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-3 backdrop-blur-md">
            <ul className="space-y-1">
              {config.footer.map((item) => {
                const FooterIcon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleAction(item)}
                      className={clsx(
                        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                        item.variant === 'danger'
                          ? 'text-red-500 hover:bg-red-500/10'
                          : item.highlight
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20'
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                        isCollapsed ? 'justify-center px-0' : ''
                      )}
                    >
                      <FooterIcon sx={{ fontSize: 20 }} />
                      <span className={clsx(
                        'overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300',
                        isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                      )}>
                        {item.label}
                      </span>
                      {isCollapsed && <SidebarTooltip text={item.label} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
