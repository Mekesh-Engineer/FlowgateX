'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { canAccessRoute, getRedirectPath } from '@/lib/routes';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'organizer' | 'admin';
  redirectTo?: string;
}

/**
 * Role-based route guard component
 * Protects routes based on user authentication and role
 */
export function RoleGuard({ children, requiredRole, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Get current path
    const currentPath = window.location.pathname;

    // Check if user can access this route
    const hasAccess = canAccessRoute(currentPath, user?.role || null);

    if (!hasAccess) {
      // Get appropriate redirect path
      const redirect = redirectTo || getRedirectPath(currentPath, user?.role || null);
      router.push(redirect);
    } else if (requiredRole && user?.role !== requiredRole) {
      // Specific role required but user has different role
      const redirect = redirectTo || getRedirectPath(currentPath, user?.role || null);
      router.push(redirect);
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no access
  if (!canAccessRoute(window.location.pathname, user?.role || null)) {
    return null;
  }

  // Specific role check
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for role-based protection
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'user' | 'organizer' | 'admin'
) {
  return function GuardedComponent(props: P) {
    return (
      <RoleGuard requiredRole={requiredRole}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
