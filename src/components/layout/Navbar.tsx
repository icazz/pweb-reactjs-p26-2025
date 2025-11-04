// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css'; 

const Navbar: React.FC = () => {
  const { user, token, logoutAction } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login'); // Arahkan ke login setelah logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Link ke /books jika sudah login, ke / jika belum */}
        <Link to={token ? "/books" : "/"}>IT Literature Shop</Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            {/* Tampil jika SUDAH login */}
            <Link to="/books">Buku</Link>
            <Link to="/transactions">Transaksi</Link>
            
            {/* Tampilkan email user (Requirement) */}
            <span className="navbar-user">
              {user?.email} {/* Tampilkan email atau username */}
            </span>
            
            {/* Tombol Logout (Requirement) */}
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Tampil jika BELUM login */}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;