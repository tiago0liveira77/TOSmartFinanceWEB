import { useQuery, useMutation } from '@tanstack/react-query';
import { aiApi, type ChatMessage } from '@/api/ai.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { currentYearMonth } from '@/utils/date';

export function useAIInsights(month = currentYearMonth()) {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_INSIGHTS, month],
    queryFn: () => aiApi.getInsights(month),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAIForecast() {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_FORECAST],
    queryFn: aiApi.getForecast,
    staleTime: 1000 * 60 * 30,
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: (messages: ChatMessage[]) => aiApi.chat(messages),
  });
}
