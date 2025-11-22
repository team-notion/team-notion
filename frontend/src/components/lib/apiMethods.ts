import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";
import { decodeJWT } from './../utils/decoder';

const isSanctumToken = (token: string): boolean => {
  return token.includes("|")
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  if (isSanctumToken(token)) {
    return false
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
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
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

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // else {
    //   delete config.headers.Authorization;
    // }
    if (!config.headers.Authorization) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export const getData = async (url: string, config?: AxiosRequestConfig) => {
  const resp = await axiosInstance.get(
    url,
    config,
  );
  return resp;
};

export const postData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const resp = await axiosInstance.post(
    url,
    reqBody,
    config,
  );
  return resp;
};

export const patchData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const resp = await axiosInstance.patch(
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
  return resp;
};

export const putData = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const resp = await axiosInstance.put(
    url,
    reqBody,
    config,
  );
  return resp;
};

export const deleteData = async (url: string, config?: AxiosRequestConfig) => {
  const resp = await axiosInstance.delete(
    url,
    config,
  );
  return resp;
};

export const getDataWithToken = async (url: string, token: string, config?: AxiosRequestConfig) => {
  const resp = await axios.get(url, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'application/json',
      'secureddata': 'getall',
      'Authorization': `Bearer ${token}`
    }
  });
  return resp;
};