import axios from 'axios';

// Ganti dengan URL API Anda dari modul sebelumnya
const API_URL = 'http://localhost:8080'; // Contoh

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Menambahkan token ke setiap request JIKA token ada 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;