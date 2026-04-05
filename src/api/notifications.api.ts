import { apiClient } from './client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'WARNING';
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};
