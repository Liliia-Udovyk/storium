import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const getToken = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)session\s*=\s*([^;]*).*$)|^.*$/, '$1');
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config) => {
    if (config.headers?.Authorization) return config;
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * for client request's
 * @returns axios instance
 */
export const http = async <T>({
  url,
  method = 'GET',
  params,
  data,
  ...rest
}: AxiosRequestConfig): Promise<AxiosResponse<T>> => instance({ url, method, params, data, ...rest });
