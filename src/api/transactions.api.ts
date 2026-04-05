import { apiClient } from './client';
import type { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionFilters } from '@/types/transaction.types';
import type { PaginatedResponse } from '@/types/api.types';

export const transactionsApi = {
  list: async (filters: TransactionFilters = {}): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  importCsv: async (file: File): Promise<{ imported: number; errors: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ imported: number; errors: number }>(
      '/transactions/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};
