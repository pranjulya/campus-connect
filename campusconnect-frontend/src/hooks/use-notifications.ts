import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useNotifications = () => {
  const { data, ...rest } = useQuery(['notifications'], () => apiClient.get('/notifications'));

  return { notifications: data?.data, ...rest };
};
