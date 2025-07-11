import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const authData = localStorage.getItem('persist:root');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        const auth = JSON.parse(parsedAuth.auth); // نفك تشفير auth داخل persist
        const token = auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
