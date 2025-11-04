// Tipe User berdasarkan endpoint /auth/me
export interface User {
  id: string;
  email: string;
  username?: string; // Sesuai API, username ada
}

// Tipe Respons dari /auth/login
export interface LoginResponse {
  access_token: string;
}

// Tipe Respons dari /auth/register
export interface RegisterResponse {
  id: string;
  email: string;
  created_at: string;
}