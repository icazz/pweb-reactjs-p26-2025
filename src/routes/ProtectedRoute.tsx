import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  // 1. Tunggu jika AuthContext sedang memvalidasi token awal
  if (isLoading) {
    return <div>Loading authentication...</div>; // Atau tampilkan spinner
  }

  // 2. Jika sudah tidak loading dan tidak ada token, redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika ada token, tampilkan halaman
  return <Outlet />;
};

export default ProtectedRoute;