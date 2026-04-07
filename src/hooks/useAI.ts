import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '@/api/ai.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { currentYearMonth } from '@/utils/date';

export function useAIInsights(month = currentYearMonth()) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_INSIGHTS, month],
    queryFn: () => aiApi.getInsights(month),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}

export function useRefreshInsights(month = currentYearMonth()) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aiApi.refreshInsights(month),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.AI_INSIGHTS, month], data);
    },
  });
}

export function useAIForecast(months = 3) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_FORECAST, months],
    queryFn: () => aiApi.getForecast(months),
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({ message, conversationId }: { message: string; conversationId?: string }) =>
      aiApi.chat(message, conversationId),
  });
}

export function useClearChat() {
  return useMutation({
    mutationFn: (conversationId: string) => aiApi.clearChat(conversationId),
  });
}
