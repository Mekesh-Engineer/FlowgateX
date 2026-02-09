// =============================================================================
// DASHBOARD LAYOUT — Preline-style React component (no Preline JS dependency)
// =============================================================================
// Replaces all hs-dropdown / hs-overlay / data-hs-theme-click-value behavior
// with React useState + useEffect. Every Tailwind class from the original
// Preline template is preserved for pixel-perfect UI fidelity.
// =============================================================================

import { type ReactNode, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NAV_ITEMS, UserRole } from '@/lib/constants';
import Logo from '../../common/Logo';
import {
  RoleHeader,
  EventSwitcher,
  SystemHealthWidget,
  StatsWidget,
  IoTStatusWidget,
  QuickSettingsWidget,
  SystemInfoFooter,
  SidebarTooltip,
} from './sidebar';
import CalendarModal from './CalendarModal';
import CartModal from './CartModal';
import NotificationDropdown from './NotificationDropdown';
import {
  Search,
  ShoppingCart,
  BarChart3,
  CalendarDays,
  Users,
  Settings,
  Layers,
} from 'lucide-react';

// =============================================================================
// SIDEBAR CONFIGURATION — role-specific search & badge config
// =============================================================================

const SIDEBAR_CONFIG = {
  [UserRole.USER]: {
    searchPlaceholder: 'Search events...',
    sectionLabel: 'Menu',
  },
  [UserRole.ORGANIZER]: {
    searchPlaceholder: 'Search events or IoT...',
    sectionLabel: 'Organizer',
  },
  [UserRole.ADMIN]: {
    searchPlaceholder: 'Search system...',
    sectionLabel: 'Admin',
  },
  [UserRole.SUPER_ADMIN]: {
    searchPlaceholder: 'Search system...',
    sectionLabel: 'Admin',
  },
};

/** Badge config for nav items — keys match the `label` in NAV_ITEMS */
const NAV_BADGES: Record<string, { count: number; color: string }> = {
  'My Tickets': { count: 3, color: 'dash-nav-badge-purple' },
  'Event Catalog': { count: 0, color: '' },
  'Attendees': { count: 12, color: 'dash-nav-badge-primary' },
  'IoT Devices': { count: 1, color: 'dash-nav-badge-amber' },
};

/** Items that get a gradient CTA highlight (by label) */
const GRADIENT_ITEMS = new Set(['Events']);

// =============================================================================
// TYPES
// =============================================================================

export interface DashboardLayoutProps {
  children?: ReactNode;
}

type Theme = 'light' | 'dark' | 'auto';

interface Breadcrumb {
  label: string;
  href: string;
  isLast: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // ── Auth & role-aware nav ──────────────────────────────────────────────
  const { user } = useAuth();
  const location = useLocation();

  const sidebarNavItems = useMemo(() => {
    switch (user?.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return NAV_ITEMS.admin;
      case UserRole.ORGANIZER:
        return NAV_ITEMS.organizer;
      default:
        return NAV_ITEMS.user;
    }
  }, [user?.role]);

  // ── Derived role helpers ────────────────────────────────────────────────
  const userRole = user?.role ?? UserRole.USER;
  const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;
  const isOrganizer = userRole === UserRole.ORGANIZER;
  const isAttendee = !isAdmin && !isOrganizer;
  const sidebarConfig = SIDEBAR_CONFIG[userRole] ?? SIDEBAR_CONFIG[UserRole.USER];

  // ── Get display role name ───────────────────────────────────────────────
  const getRoleDisplayName = useCallback(() => {
    switch (userRole) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return 'Admin';
      case UserRole.ORGANIZER:
        return 'Organizer';
      default:
        return 'Attendee';
    }
  }, [userRole]);

  const getRoleBadgeClass = useCallback(() => {
    switch (userRole) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return 'is-admin';
      case UserRole.ORGANIZER:
        return 'is-organizer';
      default:
        return 'is-user';
    }
  }, [userRole]);

  // ── State ──────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapsed (icon-only) mode
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto';
    return (localStorage.getItem('theme') as Theme) || 'auto';
  });

  // ── Refs for outside-click detection ───────────────────────────────────
  const accountRef = useRef<HTMLDivElement>(null);

  // ── Close dropdowns on outside click ───────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Theme management ───────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else {
      // auto — respect OS preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for OS theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      if (e.matches) root.classList.add('dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // ── Close all dropdowns helper ─────────────────────────────────────────
  const closeAllDropdowns = useCallback(() => {
    setAccountDropdownOpen(false);
  }, []);

  // ── Escape key closes everything ───────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Escape closes everything
      if (e.key === 'Escape') {
        closeAllDropdowns();
        setSidebarOpen(false);
        setCalendarModalOpen(false);
      }
      
      // Ctrl+K or Cmd+K focuses search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeAllDropdowns]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const toggleSidebar = useCallback(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setDesktopSidebarOpen((v) => !v);
    } else {
      setSidebarOpen((v) => !v);
    }
  }, []);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setDesktopSidebarOpen(false);
  }, []);

  const toggleAccountDropdown = useCallback(() => {
    setAccountDropdownOpen((v) => !v);
  }, []);

  // ── Dynamic breadcrumb generation ──────────────────────────────────────
  const breadcrumbs = useMemo((): Breadcrumb[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];

    // Build breadcrumb array from path segments
    const crumbs: Breadcrumb[] = [];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Format label: capitalize and replace hyphens/underscores with spaces
      const label = segment
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Try to find a matching nav item for more descriptive labels
      const allNavItems = [...NAV_ITEMS.user, ...NAV_ITEMS.organizer, ...NAV_ITEMS.admin];
      const navItem = allNavItems.find(item => item.path === currentPath);

      crumbs.push({
        label: navItem?.label || label,
        href: currentPath,
        isLast,
      });
    });

    return crumbs;
  }, [location.pathname]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="dash-header">
        <nav className="dash-header-nav">
          <div className="dash-header-content">
            <ul className="dash-header-left">
              {/* ─── Logo + Sidebar Toggle ─── */}
              <li className="dash-header-item" style={{ gap: '0.75rem' }}>
                {/* Brand Wrapper */}
                <div className="flex items-center gap-x-2">
                  <Logo size="xs" linkToHome={true} showText={false} className="shrink-0" />
                  <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    FlowGateX
                  </span>
                </div>

                <div className="hidden sm:block" />

                {/* Sidebar Toggle */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="dash-sidebar-toggle"
                  aria-haspopup="dialog"
                  aria-expanded={sidebarOpen}
                  aria-controls="hs-pro-sidebar"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /><path d="m10 15-3-3 3-3" /></svg>
                  <span className="sr-only">Sidebar Toggle</span>
                </button>
                {/* End Sidebar Toggle */}
              </li>

              {/* ─── Breadcrumb Navigation (Desktop Only) ─── */}
              <li className="dash-header-item breadcrumb-desktop tablet-up">
                <ol className="flex items-center whitespace-nowrap">
                  {/* Home */}
                  <li className="inline-flex items-center">
                    <Link
                      to="/"
                      className="dash-breadcrumb-link"
                    >
                      <svg
                        className="shrink-0 me-3 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Home
                    </Link>
                  </li>

                  {breadcrumbs.map((crumb) => (
                    <li key={crumb.href} className="inline-flex items-center">
                      <svg
                        className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>

                      {crumb.isLast ? (
                        <span
                          className="dash-breadcrumb-current"
                          aria-current="page"
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          to={crumb.href}
                          className="dash-breadcrumb-link"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </li>
              {/* ─── End Breadcrumb Navigation ─── */}
            </ul>

            {/* ─── Right side: Search, Role Features, Notifications, Account ─── */}
              <ul className="dash-header-right">
                {/* Search Icon (Mobile/Tablet) */}
                <li className="dash-header-item-right lg:hidden">
                  <button
                    type="button"
                    className="dash-search-icon-btn"
                    onClick={() => searchInputRef.current?.focus()}
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </li>

                {/* Search Bar (Desktop Only) */}
                <li className="dash-header-item-right desktop-only">
                  <div className={`dash-search-bar ${searchFocused ? 'is-focused' : ''}`}>
                    <Search size={16} className="dash-search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      className="dash-search-input"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                    <span className="dash-search-shortcut">⌘K</span>
                  </div>
                </li>

                {/* ─── Role-Specific Features ─── */}
                
                {/* Attendee: Shopping Cart (All Screen Sizes) */}
                {isAttendee && (
                  <li className="dash-header-item-right">
                    <button
                      type="button"
                      className="dash-header-icon-btn-mobile"
                      onClick={() => setCartModalOpen(true)}
                      aria-label="Shopping Cart (2 items)"
                    >
                      <ShoppingCart size={18} />
                      <span className="dash-icon-badge">2</span>
                    </button>
                  </li>
                )}

                {/* Organizer: Manage Events + Analytics Dashboard (Desktop Only) */}
                {isOrganizer && (
                  <li className="dash-header-item-right desktop-only">
                    <Link to="/organizer/events" className="dash-feature-btn">
                      <Layers size={16} />
                      Manage Events
                    </Link>
                    <Link to="/organizer/analytics" className="dash-feature-btn">
                      <BarChart3 size={16} />
                      Analytics
                    </Link>
                  </li>
                )}

                {/* Admin: User Management + System Settings (Desktop Only) */}
                {isAdmin && (
                  <li className="dash-header-item-right desktop-only">
                    <Link to="/admin/users" className="dash-feature-btn">
                      <Users size={16} />
                      User Management
                    </Link>
                    <Link to="/admin/settings" className="dash-feature-btn">
                      <Settings size={16} />
                      System Settings
                    </Link>
                  </li>
                )}

                {/* Calendar Button (All Screen Sizes) */}
                <li className="dash-header-item-right">
                  <button
                    type="button"
                    className="dash-header-icon-btn-mobile"
                    onClick={() => setCalendarModalOpen(true)}
                    aria-label="Open Calendar"
                  >
                    <CalendarDays size={18} />
                  </button>
                </li>

                {/* Notifications */}
                <li className="dash-header-item-right">
                  <NotificationDropdown />
                </li>

                {/* User Profile */}
                <li className="dash-header-item-right">
                  <div className="flex items-center">
                    {/* Desktop: Show name and role */}
                    <div className="dash-user-info desktop-only">
                      <span className="dash-user-name">
                        {user?.displayName || 'Guest User'}
                      </span>
                      <span className={`dash-role-badge ${getRoleBadgeClass()}`}>
                        {getRoleDisplayName()}
                      </span>
                    </div>

                    {/* Account Dropdown */}
                    <div ref={accountRef} className="inline-flex relative text-start">
                      <button
                        id="hs-dnad"
                        type="button"
                        onClick={toggleAccountDropdown}
                        className="dash-account-trigger"
                        aria-haspopup="menu"
                        aria-expanded={accountDropdownOpen}
                        aria-label="User menu"
                      >
                        <img
                          className="shrink-0 size-8 rounded-full border-2 border-[var(--border-primary)]"
                          src={user?.photoURL || 'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80'}
                          alt={user?.displayName || 'User Avatar'}
                        />
                      </button>

                      {/* Account Dropdown Panel */}
                      <div
                        className={`dash-dropdown-panel is-right is-wide ${accountDropdownOpen ? 'is-open' : ''}`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="hs-dnad"
                      >
                        <div className="dash-account-info">
                          <span className="dash-account-name">
                            {user?.displayName || 'Guest User'}
                          </span>
                          <p className="dash-account-email">
                            {user?.email || 'No email'}
                          </p>
                          <span className={`dash-role-badge mt-1.5 ${getRoleBadgeClass()}`}>
                            {getRoleDisplayName()}
                          </span>
                        </div>

                        <div className="dash-theme-row">
                          {/* Theme Switch/Toggle */}
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <span className="dash-theme-label">Theme</span>
                            <div className="dash-theme-group">
                              {/* Light */}
                              <button
                                type="button"
                                onClick={() => setTheme('light')}
                                className={`dash-theme-btn ${theme === 'light' ? 'is-active' : ''}`}
                              >
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 3v1" /><path d="M12 20v1" /><path d="M3 12h1" /><path d="M20 12h1" /><path d="m18.364 5.636-.707.707" /><path d="m6.343 17.657-.707.707" /><path d="m5.636 5.636.707.707" /><path d="m17.657 17.657.707.707" /></svg>
                                <span className="sr-only">Default (Light)</span>
                              </button>
                              {/* Dark */}
                              <button
                                type="button"
                                onClick={() => setTheme('dark')}
                                className={`dash-theme-btn ${theme === 'dark' ? 'is-active-dark' : ''}`}
                              >
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                                <span className="sr-only">Dark</span>
                              </button>
                              {/* Auto */}
                              <button
                                type="button"
                                onClick={() => setTheme('auto')}
                                className={`dash-theme-btn ${theme === 'auto' ? 'is-active' : ''}`}
                              >
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                <span className="sr-only">Auto (System)</span>
                              </button>
                            </div>
                          </div>
                          {/* End Theme Switch/Toggle */}
                        </div>

                        <div className="dash-dropdown-divider">
                          <Link className="dash-account-menu-item" to="/profile" onClick={() => setAccountDropdownOpen(false)}>
                            <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Profile
                          </Link>
                          <a className="dash-account-menu-item" href="#">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                            Settings
                          </a>
                          <a className="dash-account-menu-item" href="#">
                            <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                            Log out
                          </a>
                        </div>
                      </div>
                      {/* End Account Dropdown Panel */}
                    </div>
                    {/* End Account Dropdown */}
                  </div>
                </li>
              </ul>
          </div>
        </nav>
      </header>
      {/* ========== END HEADER ========== */}

      {/* ========== MOBILE BREADCRUMB ROW ========== */}
      <nav className="dash-breadcrumb-row" aria-label="Mobile breadcrumb">
        <ol className="flex items-center whitespace-nowrap gap-1">
          <li className="inline-flex items-center">
            <Link to="/" className="dash-breadcrumb-link">
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
          </li>
          {breadcrumbs.map((crumb) => (
            <li key={crumb.href} className="inline-flex items-center gap-1">
              <svg
                className="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              {crumb.isLast ? (
                <span className="dash-breadcrumb-current" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.href} className="dash-breadcrumb-link">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {/* ========== END MOBILE BREADCRUMB ROW ========== */}

      {/* ========== MAIN SIDEBAR ========== */}

      {/* Mobile backdrop overlay (always mounted, opacity-transitioned) */}
      <div
        className={`dash-sidebar-overlay ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        id="hs-pro-sidebar"
        className={`dash-sidebar ${sidebarOpen ? 'is-mobile-open' : ''} ${desktopSidebarOpen ? 'is-desktop-open' : ''}`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="dash-sidebar-inner">

          {/* ── NEW: Role Header ──────────────────────────────────────────── */}
          <div className="dash-sidebar-top">
            <div className="dash-sidebar-toolbar">

              {/* Sidebar Close Toggle - Visible on all screen sizes */}
              <button
                type="button"
                onClick={closeSidebar}
                className="dash-sidebar-close"
                aria-label="Close sidebar"
              >
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                <span className="sr-only">Close Sidebar</span>
              </button>
              {/* End Sidebar Close Toggle */}
            </div>

            <RoleHeader role={userRole} user={user} isCollapsed={isCollapsed} />
          </div>

          {/* Body */}
          <nav className="dash-sidebar-body">

            {/* ── NEW: Role-specific Top Widgets ──────────────────────────── */}
            {isOrganizer && <EventSwitcher isCollapsed={isCollapsed} />}
            {isAdmin && <SystemHealthWidget isCollapsed={isCollapsed} />}

            {/* EXISTING: Search (Updated with Dynamic Placeholder) */}
            <button type="button" className="dash-sidebar-search">
              {sidebarConfig.searchPlaceholder}
              <span className="dash-search-kbd">
                <svg className="shrink-0 size-2.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" /></svg>
                <span className="text-[11px] uppercase">k</span>
              </span>
            </button>

            {/* ── NEW: Stats Widget for Users ── */}
            {!isAdmin && !isOrganizer && <div className="mt-2"><StatsWidget isCollapsed={isCollapsed} /></div>}

            {/* ─── Role-based Navigation ─── */}
            <div className="dash-nav-section">
              <span className="dash-nav-section-label">
                {sidebarConfig.sectionLabel}
              </span>
              <ul className="dash-nav-list">
                {sidebarNavItems.map((item) => {
                  const badge = NAV_BADGES[item.label];
                  const isGradientItem = isOrganizer && GRADIENT_ITEMS.has(item.label);

                  return (
                    <li key={item.path}>
                      <SidebarTooltip label={item.label} isCollapsed={isCollapsed}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/dashboard' || item.path === '/organizer' || item.path === '/admin'}
                          className={({ isActive }) =>
                            `dash-nav-link ${isGradientItem && !isActive
                              ? 'is-gradient'
                              : isActive
                                ? 'is-active'
                                : ''
                            }`
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="dash-nav-link-label">{item.label}</span>
                          {badge && badge.count > 0 && (
                            <span className={`dash-nav-badge ${badge.color}`}>
                              {badge.count}
                            </span>
                          )}
                        </NavLink>
                      </SidebarTooltip>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── NEW: Operational Widgets (Bottom) ────────────────────────── */}
            {isOrganizer && <IoTStatusWidget isCollapsed={isCollapsed} />}
            {!isAdmin && !isOrganizer && <QuickSettingsWidget theme={theme} setTheme={setTheme} isCollapsed={isCollapsed} />}

            {/* Others (mobile only) */}
            <div className="dash-nav-section mobile-only">
              <span className="dash-nav-section-label">
                Others
              </span>
              <ul className="dash-nav-list">
                <li>
                  <a className="dash-nav-link" href="#">
                    Docs
                  </a>
                </li>
                <li>
                  <a className="dash-nav-link" href="#">
                    API
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          {/* End Body */}

          {/* Footer */}
          <footer className="dash-sidebar-footer">
            <ul className="dash-sidebar-footer-list">
              <li>
                <a className="dash-sidebar-footer-link" href="#">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                  {!isCollapsed && <>What&apos;s new?</>}
                </a>
              </li>
              <li>
                <Link to="/support" className="dash-sidebar-footer-link">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                  {!isCollapsed && <>Help &amp; support</>}
                </Link>
              </li>
              <li>
                <a className="dash-sidebar-footer-link mobile-only" href="#">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>
                  Knowledge Base
                </a>
              </li>
            </ul>

          </footer>
          {/* End Footer */}

          {/* ── NEW: Admin System Info Footer ──────────────────────────────── */}
          {isAdmin && <SystemInfoFooter isCollapsed={isCollapsed} />}
        </div>
      </div>
      {/* End Sidebar */}
      {/* ========== END MAIN SIDEBAR ========== */}

      {/* ========== MAIN CONTENT ========== */}
      <main className={`dash-main ${desktopSidebarOpen ? 'sidebar-visible' : ''}`}>
        <div className="dash-main-card">
          {/* Body */}
          <div className="dash-main-body">
            <div className="dash-main-row">
              <div className="dash-main-primary">
                {children ?? <Outlet />}
              </div>
              {/* End Col */}
            </div>
          </div>
          {/* End Body */}
        </div>
      </main>
      {/* ========== END MAIN CONTENT ========== */}

      {/* ========== CALENDAR MODAL ========== */}
      <CalendarModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
      />

      {/* ========== CART MODAL ========== */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />
    </>
  );
}

