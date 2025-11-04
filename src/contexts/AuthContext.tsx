import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user.types';
import { getMeService } from '../services/authService';
import api from '../services/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  loginAction: (token: string) => Promise<void>;
  logoutAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {

          const userData = await getMeService();
          setUser(userData);
        } catch (error) {

          console.error("Token tidak valid, logout.");
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);


  const loginAction = async (newToken: string) => {
    localStorage.setItem('token', newToken); 
    setToken(newToken);
    try {
      const userData = await getMeService();
      setUser(userData);
    } catch (error) {
      console.error("Gagal mengambil data user setelah login", error);
      logoutAction();
    }
  };

  const logoutAction = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Setup interceptor Axios untuk auto-logout jika token expired (401)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Hanya logout jika error BUKAN dari /auth/login (invalid credential)
        if (!error.config.url.endsWith('/auth/login')) {
          logoutAction();
        }
      }
      return Promise.reject(error);
    }
  );

  const value = {
    token,
    user,
    isLoading,
    loginAction,
    logoutAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};