import { apiClient } from './client';
import type { DailyBreakdown, MonthlySummary, MonthlyTrend } from '@/types/report.types';

export const reportsApi = {
  // Backend: GET /reports/summary?year=N&month=N
  getMonthlySummary: async (month: string): Promise<MonthlySummary> => {
    const [year, m] = month.split('-').map(Number);
    const response = await apiClient.get<MonthlySummary>('/reports/summary', {
      params: { year, month: m },
    });
    return response.data;
  },

  getMonthlyTrend: async (fromMonth?: string, months = 6): Promise<MonthlyTrend[]> => {
    const response = await apiClient.get<MonthlyTrend[]>('/reports/monthly-trend', {
      params: { fromMonth, months },
    });
    return response.data;
  },

  getDailyBreakdown: async (month: string): Promise<DailyBreakdown[]> => {
    const [year, m] = month.split('-').map(Number);
    const response = await apiClient.get<DailyBreakdown[]>('/reports/daily-breakdown', {
      params: { year, month: m },
    });
    return response.data;
  },
};
