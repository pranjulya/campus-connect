import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useEnrolledCourses = () => {
  const { data, ...rest } = useQuery(['enrolled-courses'], () => apiClient.get('/users/me/courses'));

  return { courses: data?.data, ...rest };
};
