import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useApi = (url: string) => {
  const mutation = useMutation((data: any) => apiClient.post(url, data));

  return mutation;
};
