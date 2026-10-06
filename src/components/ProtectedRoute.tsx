import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type ProtectedRouteProps = {
  children: React.ReactNode;
  userType?: 'guest' | 'host' | 'admin';
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType: requiredType }) => {
  const { user, userType, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const wrongType = !!user && !!requiredType && userType !== requiredType;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page',
      });
    } else if (wrongType) {
      toast({
        title: 'Access denied',
        description: `You need a ${requiredType} account to access this page`,
        variant: 'destructive',
      });
    }
  }, [loading, user, wrongType, requiredType, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (wrongType) {
    return <Navigate to={userType === 'host' ? '/host-dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
