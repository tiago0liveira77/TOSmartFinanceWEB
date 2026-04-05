import { apiClient } from './client';
import type { ForecastMonth } from '@/types/report.types';

export interface AIInsight {
  id: string;
  type: 'SPENDING' | 'SAVING' | 'BUDGET' | 'TREND';
  title: string;
  description: string;
  month: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const aiApi = {
  getInsights: async (month: string): Promise<AIInsight[]> => {
    const response = await apiClient.get<AIInsight[]>('/ai/insights', { params: { month } });
    return response.data;
  },

  getForecast: async (): Promise<ForecastMonth[]> => {
    const response = await apiClient.get<ForecastMonth[]>('/ai/forecast');
    return response.data;
  },

  chat: async (messages: ChatMessage[]): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>('/ai/chat', { messages });
    return response.data;
  },
};
