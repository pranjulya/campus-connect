import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const useCourses = () => {
  const { data, ...rest } = useQuery(['courses'], () => apiClient.get('/courses'));

  return { courses: data?.data, ...rest };
};
