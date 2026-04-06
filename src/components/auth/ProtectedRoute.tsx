import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api/auth.api';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, accessToken, setAccessToken, logout } = useAuthStore();

  // True when we have a persisted session but no in-memory token (page refresh case)
  const needsSilentRefresh = isAuthenticated && !accessToken;
  const [refreshing, setRefreshing] = useState(needsSilentRefresh);

  useEffect(() => {
    if (!needsSilentRefresh) return;

    authApi.refreshToken()
      .then(({ accessToken: token }) => setAccessToken(token))
      .catch(() => logout())
      .finally(() => setRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (refreshing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
