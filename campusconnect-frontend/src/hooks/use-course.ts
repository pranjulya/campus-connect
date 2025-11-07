import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const useCourse = (id: string) => {
  const { data, ...rest } = useQuery(['course', id], () => apiClient.get(`/courses/${id}`));

  return { course: data?.data, ...rest };
};
