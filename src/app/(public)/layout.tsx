'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Sidebar from '@/components/layout/sidebar';
import { useAuth } from '@/providers/auth-provider';
import { RootState } from '@/store';
import { setSidebarOpen, toggleSidebarCollapse } from '@/store/slices/ui.slice';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  // Redux UI state for sidebar
  const { sidebarOpen, sidebarCollapsed } = useSelector(
    (state: RootState) => state.ui
  );

  // Determine user role - defaults to 'guest' if not authenticated
  const userRole = user?.role || 'guest';

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Off-canvas Sidebar - Available on all pages */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => dispatch(toggleSidebarCollapse())}
      />

      {/* Main Content Wrapper - Slides with sidebar */}
      <div
        className={clsx(
          'flex flex-1 flex-col transition-all duration-300 ease-out',
          // Mobile: Push content when sidebar opens
          sidebarOpen && 'translate-x-64',
          // Desktop: Adjust margin based on collapsed state (optional for public)
          // 'lg:ml-0', // Public pages typically don't need permanent sidebar space
          // Reset mobile translation on desktop
          'lg:translate-x-0'
        )}
        style={{ willChange: 'transform' }}
      >
        {/* Public Header/Navbar - Fixed at top with z-50 */}
        <Header showSidebarTrigger={true} />
        
        {/* Main Content */}
        <main className="flex-1">{children}</main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
