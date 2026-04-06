import { apiClient } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  updateMe: async (data: { name: string }): Promise<User> => {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put('/users/me/password', data);
  },
};
