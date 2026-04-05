import { apiClient } from './client';
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '@/types/budget.types';

export const budgetsApi = {
  list: async (month?: string): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>('/budgets', { params: { month } });
    return response.data;
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await apiClient.post<Budget>('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await apiClient.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};
