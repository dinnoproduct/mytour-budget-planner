import axios, { type AxiosRequestConfig } from 'axios';
import { BASE_URL, type Methods } from '../constants/constants.ts';

type TRequestConfig = Omit<AxiosRequestConfig, 'url' | 'method'>;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   config.headers['Accept-Language'] = i18n.language;
//   config.headers['Authorization'] = token ? `Bearer ${token}` : null;
//
//   return config;
// });

export const request = <T>(method: Methods, url: string, configs?: TRequestConfig): Promise<{ data: T }> =>
  axiosInstance({ method, url, ...configs });
