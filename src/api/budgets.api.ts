import { apiClient } from './client';
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '@/types/budget.types';

// Estrutura raw que /reports/budget-status devolve
interface BudgetStatusRaw {
  budgetId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  percentage: number;
  remaining: number;
  status: string;
}

export const budgetsApi = {
  // Lista orçamentos com campos calculados (spent, remaining, percentage)
  list: async (_month?: string): Promise<Budget[]> => {
    const response = await apiClient.get<BudgetStatusRaw[]>('/reports/budget-status');
    return response.data.map((b) => ({
      id: b.budgetId,
      categoryId: '',
      categoryName: b.categoryName,
      categoryIcon: '',
      categoryColor: '#6b7280',
      amount: b.budgetAmount,
      spent: b.spent,
      remaining: b.remaining,
      percentage: b.percentage,
      month: _month ?? '',
      createdAt: '',
    }));
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const [year, month] = data.month.split('-');
    const payload = {
      categoryId: data.categoryId,
      amount: data.amount,
      period: 'MONTHLY',
      startDate: `${year}-${month}-01`,
    };
    const response = await apiClient.post<Budget>('/budgets', payload);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await apiClient.put<Budget>(`/budgets/${id}`, { amount: data.amount });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};
