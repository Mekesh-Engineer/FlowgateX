import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================
// Wraps routes that require authentication
// Redirects to login page if user is not authenticated
// Preserves the original destination in location state for post-login redirect
//
// Usage:
//   <ProtectedRoute>
//     <UserDashboard />
//   </ProtectedRoute>
// =============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verifying authentication..." />;
  }

  // Redirect to login if not authenticated, preserving the original destination
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

export default ProtectedRoute;
