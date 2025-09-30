import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);

  // Check if we have auth tokens in localStorage (for OAuth callback scenario)
  const hasAuthToken = localStorage.getItem('auth_token');

  useEffect(() => {
    // If we have tokens but no user, we might be in an OAuth callback scenario
    if (hasAuthToken && !currentUser && !loading) {
      setIsOAuthCallback(true);
      // Give a moment for the context to update
      const timer = setTimeout(() => {
        setIsOAuthCallback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasAuthToken, currentUser, loading]);

  if (loading || isOAuthCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{isOAuthCallback ? 'Completing login...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};



