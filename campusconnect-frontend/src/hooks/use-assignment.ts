import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const useAssignment = (courseId: string, assignmentId: string) => {
  const { data, ...rest } = useQuery(['assignment', assignmentId], () =>
    apiClient.get(`/courses/${courseId}/assignments/${assignmentId}`)
  );

  return { assignment: data?.data, ...rest };
};
