import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Store the intended destination before redirecting to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;