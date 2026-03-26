import axios from 'axios';

export const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api`,
});

// Request interceptor to add token and handle errors
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
