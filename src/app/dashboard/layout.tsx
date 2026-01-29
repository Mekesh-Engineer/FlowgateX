'use client';

/**
 * @file DashboardLayout.tsx
 * @description Main layout wrapper for authenticated dashboard routes.
 * Handles sidebar toggling, authentication redirection, responsive headers, and mobile navigation.
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

// Components
import Sidebar from '@/components/layout/sidebar';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';

// Context & State
import { useAuth } from '@/providers/auth-provider';
import { RootState } from '@/store';
import { 
  setSidebarOpen, 
  toggleSidebarCollapse 
} from '@/store/slices/ui.slice';

// --- Configuration ---
const SIDEBAR_WIDTH_EXPANDED = '300px';
const SIDEBAR_WIDTH_COLLAPSED = '80px';

// --- Helper Components ---

/**
 * Full screen loading state to prevent flash of unauthenticated content
 */
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
    <div className="flex flex-col items-center gap-4" role="status">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      <p className="text-sm font-medium text-[var(--text-muted)]">Initializing Dashboard...</p>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

/**
 * Desktop Header Component
 */
const DesktopHeader = ({ 
  collapsed, 
  onToggle, 
  role, 
  userInitials 
}: { 
  collapsed: boolean; 
  onToggle: () => void; 
  role: string;
  userInitials: string;
}) => (
  <header className="sticky top-0 z-30 hidden h-16 w-full items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-card)] px-6 shadow-sm lg:flex">
    <div className="flex items-center gap-4">
      <button
        onClick={onToggle}
        className="group rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="material-icons-outlined transition-transform group-hover:scale-110">
          {collapsed ? 'menu' : 'menu_open'}
        </span>
      </button>
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">
        Dashboard
      </h1>
    </div>

    {/* User Profile Section */}
    <div className="flex items-center gap-4">
      <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
        {role}
      </span>
      <div className="flex items-center gap-3 border-l border-[var(--border-secondary)] pl-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--brand-secondary)] text-sm font-bold text-white shadow-md">
          {userInitials}
        </div>
      </div>
    </div>
  </header>
);

/**
 * Mobile Header Component
 */
const MobileHeader = ({ 
  onOpenSidebar, 
  role 
}: { 
  onOpenSidebar: () => void; 
  role: string;
}) => (
  <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-card)] px-4 shadow-sm lg:hidden">
    <div className="flex items-center gap-3">
      <button
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)] active:scale-95"
        aria-label="Open sidebar menu"
      >
        <span className="material-icons-outlined text-2xl">menu</span>
      </button>
      <div className="flex items-center gap-2">
        <span className="material-icons-outlined text-[var(--primary)]">auto_awesome</span>
        <span className="font-heading text-lg font-bold text-[var(--text-primary)]">
          FlowGateX
        </span>
      </div>
    </div>
    
    <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold uppercase text-[var(--primary)]">
      {role}
    </span>
  </header>
);

// --- Main Layout Component ---

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // 1. Auth Context
  const { user, loading } = useAuth();
  
  // 2. Redux UI State
  const { sidebarOpen, sidebarCollapsed } = useSelector(
    (state: RootState) => state.ui
  );

  // 3. Derived State (Memoized for performance)
  const userData = useMemo(() => {
    if (!user) return null;

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const initials = (user.email?.substring(0, 2) || 'US').toUpperCase();
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.email || 'User';

    return {
      name: fullName,
      email: user.email || '',
      organization: 'TechEvents India', // TODO: Fetch from user.organizationId relation
      role: user.role || 'guest',
      initials,
    };
  }, [user]);

  // 4. Effects

  // Protect Route: Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Mobile UX: Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
    };
  }, [sidebarOpen]);

  // 5. Render Logic

  if (loading) return <LoadingScreen />;
  if (!user || !userData) return null; // Component will unmount via router.replace

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[var(--bg-primary)]">
      
      {/* Accessibility: Skip to Content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* --- Sidebar Navigation --- */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => dispatch(toggleSidebarCollapse())}
      />

      {/* --- Main Content Area --- */}
      <div
        className={clsx(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out',
          // Desktop margins based on sidebar state
          sidebarCollapsed ? `lg:ml-[${SIDEBAR_WIDTH_COLLAPSED}]` : `lg:ml-[${SIDEBAR_WIDTH_EXPANDED}]`
        )}
        // Inline style fallback for exact pixel matching with Sidebar component
        style={{ 
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED) 
            : '0' 
        }}
      >
        {/* Headers */}
        <DesktopHeader 
          collapsed={sidebarCollapsed} 
          onToggle={() => dispatch(toggleSidebarCollapse())}
          role={userData.role}
          userInitials={userData.initials}
        />

        <MobileHeader 
          onOpenSidebar={() => dispatch(setSidebarOpen(true))}
          role={userData.role}
        />

        {/* Scrollable Page Content */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 scroll-smooth md:p-6 pb-24 lg:pb-8"
          tabIndex={-1} // Allow programmatic focus for skip link
        >
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* --- Mobile Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <MobileBottomNav />
      </div>

      {/* Mobile Sidebar Overlay Backend (Optional - if Sidebar doesn't handle its own overlay) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
          aria-hidden="true"
        />
      )}
    </div>
  );
}