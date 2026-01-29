'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { RoleHeaderProps, UserRole } from '../types';

// MUI Icons
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Sidebar Tooltip Component
 */
export function SidebarTooltip({ text }: { text: string }) {
  return (
    <div className="animate-fadeIn absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 z-[60]">
      {text}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[var(--border-primary)]" />
      <div className="absolute right-full top-1/2 mr-[-1px] -translate-y-1/2 border-[5px] border-transparent border-r-[var(--bg-card)]" />
    </div>
  );
}

/**
 * Get role-specific configuration for header styling
 */
function getRoleConfig(role: UserRole, userProfile: RoleHeaderProps['userProfile']) {
  switch (role) {
    case 'admin':
      return {
        gradient: 'from-red-500 to-orange-500',
        IconComponent: SettingsIcon,
        title: 'Platform Admin',
        subtitle: 'System Control',
      };
    case 'organizer':
      return {
        gradient: 'from-blue-500 to-cyan-500',
        IconComponent: BusinessCenterIcon,
        title: userProfile.organization || 'Organizer',
        subtitle: 'Event Management',
      };
    case 'user':
      return {
        gradient: 'from-purple-500 to-pink-500',
        IconComponent: PersonIcon,
        title: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User',
        subtitle: userProfile.email,
      };
    default:
      return null;
  }
}

/**
 * Role Header Component
 * Displays user/role information at the top of the sidebar
 */
export function RoleHeader({ 
  role, 
  userProfile, 
  isCollapsed, 
  onToggleCollapse 
}: RoleHeaderProps) {
  const config = getRoleConfig(role, userProfile);
  if (!config) return null;

  const { gradient, IconComponent, title, subtitle } = config;
  const displayName = userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="p-4 border-b border-[var(--border-primary)]">
      <div className="flex items-center gap-3">
        {/* Avatar/Icon Container */}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0`}>
          {userProfile.avatar ? (
            <Image 
              src={userProfile.avatar} 
              alt={title} 
              width={40}
              height={40}
              className="w-full h-full rounded-lg object-cover" 
            />
          ) : role === 'user' ? (
            <span className="font-bold text-sm">{initials}</span>
          ) : (
            <IconComponent sx={{ fontSize: 20 }} />
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-[var(--text-primary)]">
              {title}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {subtitle}
            </p>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-[var(--bg-hover)] rounded-lg transition-colors shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRightIcon 
            sx={{ fontSize: 20 }}
            className={clsx('transition-transform', !isCollapsed && 'rotate-180')}
          />
        </button>
      </div>
    </div>
  );
}

export default RoleHeader;
