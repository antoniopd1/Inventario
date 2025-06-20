import axios from 'axios';
import useAuthStore from '../store/useAuthStore';


const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;


console.log("DEBUG: Axios Base URL:", API_BASE_URL); 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
