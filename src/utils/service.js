import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
   
      localStorage.clear();

      sessionStorage.clear();

     
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
