'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { OrganizerProvider } from '@/features/organizer/organizer-context';
import { useRealTimeConnection } from '@/features/organizer/realtime.service';

// ============================================================================
// Loading Component
// ============================================================================

function OrganizerLoadingScreen() {
  return (
    <div className="organizer-dashboard flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
        <p className="text-[var(--text-muted)] font-medium">Loading organizer dashboard...</p>
      </div>
    </div>
  );
}

// ============================================================================
// Access Denied Component
// ============================================================================

function AccessDenied() {
  const router = useRouter();

  return (
    <div className="organizer-dashboard flex h-screen items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
          <span className="material-icons-outlined text-[var(--status-error)] text-3xl">block</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h1>
        <p className="text-[var(--text-muted)] mb-6">
          You need organizer privileges to access this area. 
          Please contact support if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="organizer-btn organizer-btn-secondary"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="organizer-btn organizer-btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Real-time Connection Status Indicator
// ============================================================================

function ConnectionStatusIndicator({ status }: { status: string }) {
  if (status === 'connected') return null;

  return (
    <div className={`
      fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50
      flex items-center gap-2 text-sm font-medium
      ${status === 'connecting' ? 'bg-yellow-100 text-yellow-800' : ''}
      ${status === 'disconnected' ? 'bg-gray-100 text-gray-800' : ''}
      ${status === 'error' ? 'bg-red-100 text-red-800' : ''}
    `}>
      <span className={`w-2 h-2 rounded-full animate-pulse
        ${status === 'connecting' ? 'bg-yellow-500' : ''}
        ${status === 'disconnected' ? 'bg-gray-500' : ''}
        ${status === 'error' ? 'bg-red-500' : ''}
      `} />
      {status === 'connecting' && 'Connecting to live updates...'}
      {status === 'disconnected' && 'Reconnecting...'}
      {status === 'error' && 'Connection error'}
    </div>
  );
}

// ============================================================================
// Organizer Layout Content (with real-time connection)
// ============================================================================

function OrganizerLayoutContent({ children }: { children: React.ReactNode }) {
  // Temporarily disable real-time connection to prevent auth errors
  // const { status } = useRealTimeConnection({
  //   type: 'sse',
  //   endpoint: '/api/organizer/realtime',
  // });

  const status = 'disconnected'; // Placeholder until auth is properly set up

  return (
    <>
      {children}
      <ConnectionStatusIndicator status={status} />
    </>
  );
}

// ============================================================================
// Main Organizer Layout
// ============================================================================

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in - redirect to login
      router.push('/login?redirect=/dashboard/organizer');
      return;
    }

    if (user.role !== 'organizer' && user.role !== 'admin') {
      // User exists but doesn't have organizer role
      setIsAuthorized(false);
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading || isAuthorized === null) {
    return <OrganizerLoadingScreen />;
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <AccessDenied />;
  }

  // Render with providers
  return (
    <OrganizerProvider>
      <OrganizerLayoutContent>
        {children}
      </OrganizerLayoutContent>
    </OrganizerProvider>
  );
}
