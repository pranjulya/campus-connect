import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useAssignment = (courseId: string, assignmentId: string) => {
  const { data, ...rest } = useQuery(['assignment', assignmentId], () =>
    apiClient.get(`/courses/${courseId}/assignments/${assignmentId}`)
  );

  return { assignment: data?.data, ...rest };
};
