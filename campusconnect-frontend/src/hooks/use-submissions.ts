import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useSubmissions = (courseId: string, assignmentId: string) => {
  const { data, ...rest } = useQuery(['submissions', assignmentId], () =>
    apiClient.get(`/courses/${courseId}/assignments/${assignmentId}/submissions`)
  );

  return { submissions: data?.data, ...rest };
};
