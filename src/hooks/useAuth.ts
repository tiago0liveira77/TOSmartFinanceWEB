import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: [QUERY_KEYS.USER_ME],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (data: { name: string }) => authApi.updateMe(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ME] });
      // Sync the Zustand store so the name updates everywhere immediately
      if (user && accessToken) {
        setAuth({ ...user, ...updatedUser }, accessToken);
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
  });
}
