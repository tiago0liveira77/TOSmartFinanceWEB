import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/api/accounts.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { CreateAccountDto, UpdateAccountDto } from '@/types/account.types';

export function useAccounts() {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: accountsApi.list,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_DETAIL, id],
    queryFn: () => accountsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountDto) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      accountsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNT_DETAIL, id] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
    },
  });
}

export function useAccountSummary(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_DETAIL, id, 'summary'],
    queryFn: () => accountsApi.getSummary(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}
