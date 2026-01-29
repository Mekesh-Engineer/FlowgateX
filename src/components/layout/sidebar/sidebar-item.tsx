'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { SidebarItemProps } from './types';
import { SidebarTooltip } from './widgets';

// MUI Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Get badge color styles based on color prop
 */
function getBadgeStyle(color?: string) {
  switch (color) {
    case 'red': return 'bg-red-500/10 text-red-500';
    case 'blue': return 'bg-blue-500/10 text-blue-500';
    case 'green': return 'bg-green-500/10 text-green-500';
    case 'pink': return 'bg-pink-500/10 text-pink-500';
    case 'orange': return 'bg-orange-500/10 text-orange-500';
    default: return 'bg-gray-500/10 text-gray-500';
  }
}

/**
 * Sidebar Item Component
 * Handles navigation items with icons, badges, and sub-items
 */
export function SidebarItem({
  item,
  badges,
  isActive,
  onItemClick,
  isCollapsed,
  onExpand,
}: SidebarItemProps) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const badgeCount = item.badge ? badges[item.badge] || 0 : 0;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // Auto-expand submenu when active
  useEffect(() => {
    if (isActive && hasSubItems) setIsSubMenuOpen(true);
  }, [isActive, hasSubItems]);

  const handleItemClick = (e: React.MouseEvent) => {
    // Handle logout action
    if (item.action === 'logout') {
      e.preventDefault();
      onItemClick?.();
      return;
    }

    if (isCollapsed && hasSubItems) {
      e.preventDefault();
      onExpand();
      setIsSubMenuOpen(true);
      return;
    }

    if (hasSubItems) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    } else {
      onItemClick?.();
    }
  };

  // Get the Icon component from item
  const IconComponent = item.icon;

  // Check if this is a button item (has sub-items or is logout action)
  const isButton = hasSubItems || item.action === 'logout';

  return (
    <li className="relative mb-1">
      {/* Main Item - Conditional rendering based on type */}
      {isButton ? (
        <button
          type="button"
          onClick={handleItemClick}
          className={clsx(
            'group flex w-full cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
            isCollapsed ? 'mx-auto w-10 justify-center px-0' : '',
            isActive
              ? 'font-medium text-[var(--primary)] bg-[var(--primary)]/10'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
            item.variant === 'gradient' && !isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
              : item.variant === 'danger' && !isActive
              ? 'text-red-500 hover:bg-red-500/10'
              : item.highlight && !isActive
              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md'
              : ''
          )}
        >
          {/* Icon */}
          <div className={clsx(
            'relative z-10 flex h-6 w-6 items-center justify-center transition-transform duration-200',
            !isCollapsed && 'group-hover:scale-110',
            isActive && 'scale-110'
          )}>
            <IconComponent sx={{ fontSize: 20 }} />
            {isCollapsed && badgeCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-[var(--bg-card)] bg-[var(--primary)]" />
            )}
          </div>

          {/* Label & Badge */}
          <div className={clsx(
            'flex flex-1 items-center justify-between overflow-hidden transition-all duration-300',
            isCollapsed ? 'ml-0 w-0 opacity-0' : 'ml-1 w-auto opacity-100'
          )}>
            <span className="truncate text-sm tracking-wide">{item.label}</span>

            <div className="flex items-center gap-2">
              {badgeCount > 0 && (
                <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold', getBadgeStyle(item.badgeColor))}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
              {hasSubItems && (
                <ExpandMoreIcon
                  sx={{ fontSize: 18 }}
                  className={clsx(
                    'text-[var(--text-muted)] transition-transform duration-200',
                    isSubMenuOpen && 'rotate-180'
                  )}
                />
              )}
            </div>
          </div>

          {/* Tooltip (collapsed state) */}
          {isCollapsed && <SidebarTooltip text={item.label} />}
        </button>
      ) : (
        <Link
          href={item.path}
          onClick={onItemClick}
          className={clsx(
            'group flex w-full cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
            isCollapsed ? 'mx-auto w-10 justify-center px-0' : '',
            isActive
              ? 'font-medium text-[var(--primary)] bg-[var(--primary)]/10'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
            item.variant === 'gradient' && !isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
              : item.variant === 'danger' && !isActive
              ? 'text-red-500 hover:bg-red-500/10'
              : item.highlight && !isActive
              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md'
              : ''
          )}
        >
        {/* Icon */}
        <div className={clsx(
          'relative z-10 flex h-6 w-6 items-center justify-center transition-transform duration-200',
          !isCollapsed && 'group-hover:scale-110',
          isActive && 'scale-110'
        )}>
          <IconComponent sx={{ fontSize: 20 }} />
          {isCollapsed && badgeCount > 0 && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-[var(--bg-card)] bg-[var(--primary)]" />
          )}
        </div>

        {/* Label & Badge */}
        <div className={clsx(
          'flex flex-1 items-center justify-between overflow-hidden transition-all duration-300',
          isCollapsed ? 'ml-0 w-0 opacity-0' : 'ml-1 w-auto opacity-100'
        )}>
          <span className="truncate text-sm tracking-wide">{item.label}</span>

          <div className="flex items-center gap-2">
            {badgeCount > 0 && (
              <span className={clsx('rounded-full px-2 py-0.5 text-[10px] font-bold', getBadgeStyle(item.badgeColor))}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
            {hasSubItems && (
              <ExpandMoreIcon
                sx={{ fontSize: 18 }}
                className={clsx(
                  'text-[var(--text-muted)] transition-transform duration-200',
                  isSubMenuOpen && 'rotate-180'
                )}
              />
            )}
          </div>
        </div>

          {/* Tooltip (collapsed state) */}
          {isCollapsed && <SidebarTooltip text={item.label} />}
        </Link>
      )}

      {/* Sub-Items */}
      {hasSubItems && (
        <div className={clsx(
          'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
          isSubMenuOpen && !isCollapsed ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <ul className="ml-5 mt-1 space-y-1 border-l border-[var(--border-primary)] pl-3">
            {item.subItems?.map((subItem) => {
              const SubIconComponent = subItem.icon;
              return (
                <li key={subItem.id}>
                  <Link
                    href={subItem.path}
                    onClick={onItemClick}
                    className="group/sub relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
                  >
                    <SubIconComponent sx={{ fontSize: 16 }} />
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

export default SidebarItem;
