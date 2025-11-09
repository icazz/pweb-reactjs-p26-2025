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
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* --- REVISI DI SINI --- */}
        {/* Link ini sekarang selalu ke homepage (katalog) */}
        <Link to="/">IT Literature Shop</Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            {/* "Buku" sekarang merujuk ke halaman Katalog (sama seperti logo) */}
            <Link to="/books">Buku</Link> 
            <Link to="/transactions">Transaksi</Link>
            <span className="navbar-user">{user?.email}</span>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button navbar-button-secondary">Login</Link>
            <Link to="/register" className="navbar-button navbar-button-secondary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;