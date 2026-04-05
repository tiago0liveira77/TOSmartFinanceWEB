import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '@/api/budgets.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { CreateBudgetDto, UpdateBudgetDto } from '@/types/budget.types';
import { currentYearMonth } from '@/utils/date';

export function useBudgets(month = currentYearMonth()) {
  return useQuery({
    queryKey: [QUERY_KEYS.BUDGETS, month],
    queryFn: () => budgetsApi.list(month),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetDto) => budgetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) =>
      budgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });
}
