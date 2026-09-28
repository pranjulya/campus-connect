import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useNotifications = () => {
  const { data, ...rest } = useQuery(['notifications'], () => apiClient.get('/notifications'));

  return { notifications: data?.data, ...rest };
};
