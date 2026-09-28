import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useCourses = () => {
  const { data, ...rest } = useQuery(['courses'], () => apiClient.get('/courses'));

  return { courses: data?.data, ...rest };
};
