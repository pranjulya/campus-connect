import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const useApi = (url: string) => {
  const mutation = useMutation((data: any) => apiClient.post(url, data));

  return mutation;
};
