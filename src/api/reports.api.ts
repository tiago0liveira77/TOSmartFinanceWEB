import { apiClient } from './client';
import type { MonthlySummary, MonthlyTrend } from '@/types/report.types';

export const reportsApi = {
  getMonthlySummary: async (month: string): Promise<MonthlySummary> => {
    const response = await apiClient.get<MonthlySummary>('/reports/monthly-summary', {
      params: { month },
    });
    return response.data;
  },

  getMonthlyTrend: async (months = 6): Promise<MonthlyTrend[]> => {
    const response = await apiClient.get<MonthlyTrend[]>('/reports/monthly-trend', {
      params: { months },
    });
    return response.data;
  },
};
