import { apiClient } from './client';
import type { Account, AccountSummary, CreateAccountDto, UpdateAccountDto } from '@/types/account.types';

export const accountsApi = {
  list: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    const response = await apiClient.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/${id}`);
  },

  getSummary: async (id: string): Promise<AccountSummary> => {
    const response = await apiClient.get<AccountSummary>(`/accounts/${id}/summary`);
    return response.data;
  },
};
