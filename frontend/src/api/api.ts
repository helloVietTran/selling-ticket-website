import { LOCAL_STORAGE_KEYS } from "@/constant";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const axiosParams: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosInstance: AxiosInstance = axios.create(axiosParams);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN); 
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      //redirect login hoặc refresh token
      console.error("Unauthorized - token expired?");
    }
    return Promise.reject(error);
  }
);

interface Api {
  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  post(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  put(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse>;
  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
}

const api = (instance: AxiosInstance): Api => {
  return {
    get: (url, config) => instance.get(url, config),
    post: (url, data, config) => instance.post(url, data, config),
    put: (url, data, config) => instance.put(url, data, config),
    delete: (url, config) => instance.delete(url, config),
  };
};


export default api(axiosInstance);
