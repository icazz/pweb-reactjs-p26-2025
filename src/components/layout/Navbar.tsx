// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css'; 

const Navbar: React.FC = () => {
  const { user, token, logoutAction } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // --- REVISI 1: Tambahkan ini agar menu tertutup ---
    setIsMobileMenuOpen(false); 
    logoutAction();
    navigate('/login'); 
  };

  // --- REVISI 2: TAMBAHKAN FUNGSI YANG HILANG INI ---
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // Tutup menu saat link di-klik
  };
  // ----------------------------------------------

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Tambahkan onClick untuk menutup menu */}
        <Link to={token ? "/books" : "/"} onClick={handleLinkClick}>
          IT Literature Shop
        </Link>
      </div>

      {/* Tombol Hamburger (Kode Anda sudah benar) */}
      <button 
        className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      {/* Container Link (Kode Anda sudah benar) */}
      <div 
        className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}
      >
        {token ? (
          <>
            {/* --- REVISI 3: Tambahkan 'onClick={handleLinkClick}' ke semua link --- */}
            <Link to="/books" onClick={handleLinkClick}>Buku</Link>
            <Link to="/transactions" onClick={handleLinkClick}>Transaksi</Link>
            <Link to="/cart" className="navbar-cart-link" onClick={handleLinkClick}>
              Keranjang
              {totalItemsInCart > 0 && (
                <span className="cart-badge">{totalItemsInCart}</span>
              )}
            </Link>

            <span className="navbar-user">{user?.email}</span>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button navbar-button-secondary" onClick={handleLinkClick}>
              Login
            </Link>
            <Link to="/register" className="navbar-button navbar-button-secondary" onClick={handleLinkClick}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;