'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { WidgetProps, SystemHealth, SearchBarProps, StatsWidgetProps } from '../types';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { SidebarTooltip } from './role-header';

// ============================================================================
// System Health Widget (Admin)
// ============================================================================

export function SystemHealthWidget({ isCollapsed }: WidgetProps) {
  // TODO: Integrate with real admin analytics API
  const [systemHealth] = useState<SystemHealth>({
    uptime: '98%',
    activeUsers: 2401,
    liveEvents: 47,
    paymentIssues: 2,
    offlineDevices: 3,
  });

  if (isCollapsed) return null;

  return (
    <div className="p-4 border-b border-[var(--border-primary)] space-y-3">
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">System Health</p>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-bold text-[var(--text-primary)]">{systemHealth.uptime}</span>
          </div>
          <p className="text-[var(--text-muted)]">Uptime</p>
        </div>
        <div className="text-center">
          <p className="font-bold mb-1 text-[var(--text-primary)]">{systemHealth.activeUsers.toLocaleString()}</p>
          <p className="text-[var(--text-muted)]">Users</p>
        </div>
        <div className="text-center">
          <p className="font-bold mb-1 text-[var(--text-primary)]">{systemHealth.liveEvents}</p>
          <p className="text-[var(--text-muted)]">Live Events</p>
        </div>
      </div>

      {(systemHealth.paymentIssues > 0 || systemHealth.offlineDevices > 0) && (
        <div className="space-y-2">
          {systemHealth.paymentIssues > 0 && (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-800 dark:text-red-400 font-medium">
                {systemHealth.paymentIssues} Payment Issues
              </span>
            </div>
          )}
          {systemHealth.offlineDevices > 0 && (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded text-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-yellow-800 dark:text-yellow-400 font-medium">
                {systemHealth.offlineDevices} Devices Offline
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Search Bar Widget
// ============================================================================

export function SearchBar({ placeholder, isCollapsed, onExpand }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={clsx('relative mb-4 transition-all duration-300', isCollapsed ? 'px-2' : 'px-3')}>
      {/* Expanded Search Input */}
      <div className={clsx(
        'relative transition-all duration-300',
        isCollapsed ? 'pointer-events-none hidden w-0 opacity-0' : 'w-full opacity-100'
      )}>
        <SearchIcon
          sx={{ fontSize: 18 }}
          className={clsx(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300',
            isFocused ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl py-2.5 pl-10 pr-9 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)]"
            aria-label="Clear search"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      {/* Collapsed Search Button */}
      {isCollapsed && (
        <button
          onClick={onExpand}
          className="group relative mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
          aria-label="Search"
        >
          <SearchIcon sx={{ fontSize: 20 }} />
          <SidebarTooltip text="Search" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Stats Widget (User)
// ============================================================================

export function StatsWidget({ badges, isCollapsed }: StatsWidgetProps) {
  if (isCollapsed) return null;

  return (
    <div className="relative mx-3 mb-4 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--primary)] opacity-5 blur-2xl" />

      <div className="mb-3 flex items-center gap-2">
        <InsightsIcon sx={{ fontSize: 14 }} className="text-[var(--primary)]" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          Activity
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 transition-colors hover:border-[var(--primary)]">
          <p className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
            {badges.upcomingBookings || 0}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Bookings</p>
        </div>
        <div className="group rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 transition-colors hover:border-[var(--primary)]">
          <p className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
            {badges.savedCount || 0}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Saved</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Quick Settings Widget (User)
// ============================================================================

export function QuickSettingsWidget({ isCollapsed }: WidgetProps) {
  // TODO: Integrate with theme context/provider
  const [darkMode, setDarkMode] = useState(false);

  if (isCollapsed) return null;

  return (
    <div className="p-4 border-t border-[var(--border-primary)] space-y-3">
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">Quick Settings</p>
      <label className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2">
          {darkMode ? (
            <DarkModeIcon sx={{ fontSize: 16 }} />
          ) : (
            <LightModeIcon sx={{ fontSize: 16 }} />
          )}
          <span className="text-sm text-[var(--text-primary)]">Dark Mode</span>
        </div>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          className="w-10 h-5 rounded-full appearance-none bg-[var(--bg-tertiary)] checked:bg-[var(--primary)] relative cursor-pointer transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5"
        />
      </label>
    </div>
  );
}

// ============================================================================
// System Info Footer (Admin)
// ============================================================================

export function SystemInfoFooter({ isCollapsed }: WidgetProps) {
  if (isCollapsed) return null;

  return (
    <div className="p-4 border-t border-[var(--border-primary)]">
      <div className="text-xs text-[var(--text-muted)] space-y-1">
        <p>Version: 2.1.0</p>
        <p>Last Deploy: 2 hours ago</p>
        <p className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          All Systems Operational
        </p>
      </div>
    </div>
  );
}
