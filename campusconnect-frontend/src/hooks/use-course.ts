import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useCourse = (id: string) => {
  const { data, ...rest } = useQuery(['course', id], () => apiClient.get(`/courses/${id}`));

  return { course: data?.data, ...rest };
};
