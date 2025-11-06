import axios from "axios";

type ApiClientOptions = {
  getToken?: () => string | null;
};

const createApiClient = ({ getToken }: ApiClientOptions = {}) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1",
    withCredentials: false
  });

  instance.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["x-auth-token"] = token;
    }
    return config;
  });

  return instance;
};

export const apiClient = createApiClient();
export { createApiClient };
