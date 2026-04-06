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

  importCsv: async (file: File, accountId: string): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId);
    const response = await apiClient.post<{ imported: number; failed: number; errors: string[] }>(
      '/transactions/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};
