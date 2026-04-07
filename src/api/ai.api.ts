import { apiClient } from './client';
import type { ChatResponse, ForecastResponse, InsightResponse } from '@/types/ai.types';

export const aiApi = {
  getInsights: async (month: string): Promise<InsightResponse> => {
    const response = await apiClient.get<InsightResponse>('/ai/insights', {
      params: { month },
    });
    return response.data;
  },

  refreshInsights: async (month: string): Promise<InsightResponse> => {
    const response = await apiClient.post<InsightResponse>('/ai/insights/refresh', null, {
      params: { month },
    });
    return response.data;
  },

  getForecast: async (months = 3): Promise<ForecastResponse> => {
    const response = await apiClient.get<ForecastResponse>('/ai/forecast', {
      params: { months },
    });
    return response.data;
  },

  chat: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/ai/chat', {
      message,
      conversationId: conversationId ?? null,
    });
    return response.data;
  },

  clearChat: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/ai/chat/${conversationId}`);
  },
};
