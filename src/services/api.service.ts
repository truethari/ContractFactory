import axios from "axios";

const createAxiosInstance = (baseURL: string, withCredentials = false) => {
  const instance = axios.create({
    baseURL,
    withCredentials,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

export const apiURL = `/api/v1`;

export const api = createAxiosInstance(apiURL, true);
