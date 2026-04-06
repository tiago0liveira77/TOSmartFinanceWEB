import { apiClient } from './client';
import type { MonthlySummary, MonthlyTrend } from '@/types/report.types';

export const reportsApi = {
  // Backend: GET /reports/summary?year=N&month=N
  getMonthlySummary: async (month: string): Promise<MonthlySummary> => {
    const [year, m] = month.split('-').map(Number);
    const response = await apiClient.get<MonthlySummary>('/reports/summary', {
      params: { year, month: m },
    });
    return response.data;
  },

  // Backend: GET /reports/monthly-trend?months=N (year defaults to current)
  getMonthlyTrend: async (months = 6): Promise<MonthlyTrend[]> => {
    const response = await apiClient.get<MonthlyTrend[]>('/reports/monthly-trend', {
      params: { months },
    });
    return response.data;
  },
};
