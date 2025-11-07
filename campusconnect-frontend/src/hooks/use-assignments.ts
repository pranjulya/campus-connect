import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const useAssignments = (courseId: string) => {
  const { data, ...rest } = useQuery(['assignments', courseId], () =>
    apiClient.get(`/courses/${courseId}/assignments`)
  );

  return { assignments: data?.data, ...rest };
};
