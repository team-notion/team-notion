import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";
import { decodeJWT } from './../utils/decoder';

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  try {
    const decoded = decodeJWT(token);
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    }
    return true;
  } catch (err) {
    console.error("Error decoding token:", err);
    return true;
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
    return null;
  }
  
  if (isTokenExpired(token)) {
    window.dispatchEvent(new CustomEvent('auth:expired'));
    return null;
    // window.location.replace(ROUTES.SIGNIN);
  }

  return token;
};

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    config.headers = config.headers || {};

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    else {
      config.headers["Content-Type"] = "application/json";
    }

    config.headers.secureddata = "getall";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error?.response?.status === 401) {
      // Dispatch a custom event that the app can listen for
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export const getData = async (url: string, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.get(
    url,
    config,
  );
  return data;
};

export const postData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.post(
    url,
    reqBody,
    config,
  );
  return data;
};

export const patchData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.patch(
    url,
    reqBody,
    {
      ...config,
      headers: {
        ...config?.headers,
        // If reqBody is FormData, don't set Content-Type
        ...(!(reqBody instanceof FormData) && { "Content-Type": "application/json" }),
      },
    }
  );
  return data;
};

export const putData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.put(
    url,
    reqBody,
    config,
  );
  return data;
};

export const deleteData = async (url: string, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance.delete(
    url,
    config,
  );
  return data;
};
