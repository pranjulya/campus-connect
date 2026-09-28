import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useAssignments = (courseId: string) => {
  const { data, ...rest } = useQuery(['assignments', courseId], () =>
    apiClient.get(`/courses/${courseId}/assignments`)
  );

  return { assignments: data?.data, ...rest };
};
