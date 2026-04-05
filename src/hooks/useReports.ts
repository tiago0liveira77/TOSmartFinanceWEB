import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { currentYearMonth } from '@/utils/date';

export function useMonthlySummary(month = currentYearMonth()) {
  return useQuery({
    queryKey: [QUERY_KEYS.MONTHLY_SUMMARY, month],
    queryFn: () => reportsApi.getMonthlySummary(month),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMonthlyTrend(months = 6) {
  return useQuery({
    queryKey: [QUERY_KEYS.MONTHLY_TREND, months],
    queryFn: () => reportsApi.getMonthlyTrend(months),
    staleTime: 1000 * 60 * 5,
  });
}
