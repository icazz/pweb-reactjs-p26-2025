import api from './api';
import type { User, LoginResponse, RegisterResponse } from '../types/user.types';

// Mengirim data Login ke API
export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });

  if (response.data.success) {
    return response.data.data; // Mengembalikan { access_token: "..." }
  } else {
    throw new Error(response.data.message || 'Login gagal');
  }
};

// Mengirim data Register ke API
export const registerService = async (email: string, password: string, username: string): Promise<RegisterResponse> => {
  // API Anda juga menerima 'username' (opsional)
  const response = await api.post('/auth/register', { email, password, username });

  if (response.data.success) {
    return response.data.data; // Mengembalikan { id, email, created_at }
  } else {
    throw new Error(response.data.message || 'Registrasi gagal');
  }
};

// Mengirimdata user yang sedang login
export const getMeService = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal mengambil data user');
  }
};