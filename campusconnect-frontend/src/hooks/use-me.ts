import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useMe = () => {
  const { data, ...rest } = useQuery(['me'], () => apiClient.get('/users/me'));

  return { me: data?.data, ...rest };
};
