import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Shared Axios instance for every call to the Campus Connect API.
 * Attaches the signed-in user's JWT as `Authorization: Bearer <token>`,
 * which is the header the API's `protect` middleware reads.
 */
const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
