// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import hook Auth
import './HomePage.css'; // Kita akan buat file CSS ini

const HomePage: React.FC = () => {
  // Cek status login dari AuthContext
  const { token } = useAuth();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>📚 Selamat Datang di IT Literature Shop</h1>
        <p className="home-subtitle">
          Katalog dan toko buku online untuk semua kebutuhan literatur IT Anda.
        </p>
      </header>

      <div className="home-content">
        {token ? (
          // === TAMPILAN JIKA SUDAH LOGIN ===
          <>
            <p>Anda sudah login. Mulai jelajahi katalog kami sekarang.</p>
            <Link to="/books" className="home-button">
              Lihat Daftar Buku
            </Link>
          </>
        ) : (
          // === TAMPILAN JIKA BELUM LOGIN ===
          <>
            <p>Silakan login untuk mengelola buku dan melihat riwayat transaksi Anda.</p>
            <div className="home-buttons-group">
              <Link to="/login" className="home-button">
                Login
              </Link>
              <Link to="/register" className="home-button secondary">
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;