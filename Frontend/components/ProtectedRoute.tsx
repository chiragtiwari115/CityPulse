'use client';

import { useUser } from '@/lib/user-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (requireAuth && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.replace('/unauthorized');
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAuth, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}