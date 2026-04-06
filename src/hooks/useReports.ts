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

export function useMonthlyTrend(fromMonth?: string, months = 6) {
  return useQuery({
    queryKey: [QUERY_KEYS.MONTHLY_TREND, fromMonth, months],
    queryFn: () => reportsApi.getMonthlyTrend(fromMonth, months),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDailyBreakdown(month = currentYearMonth()) {
  return useQuery({
    queryKey: ['daily-breakdown', month],
    queryFn: () => reportsApi.getDailyBreakdown(month),
    staleTime: 1000 * 60 * 5,
  });
}
