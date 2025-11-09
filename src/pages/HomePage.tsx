// src/pages/HomePage.tsx
import React from 'react';
// Hapus 'useAuth' dan 'Link' karena sudah tidak dipakai di sini
import './HomePage.css'; // Impor CSS

const HomePage: React.FC = () => {
  // 'useAuth' dihapus dari sini karena tombol login/register dipindahkan
  
  return (
    // Gunakan Fragment (<>) karena sekarang ada 2 bagian (Header dan Carousel)
    <>
      {/* Bagian 1: Header Selamat Datang */}
      <div className="home-container">
        <header className="home-header">
          <h1>
            <span role="img" aria-label="books">📚</span> 
            Jelajahi Dunia Pengetahuan IT
          </h1>
          <p className="home-subtitle">
            Katalog dan toko buku online untuk semua kebutuhan literatur IT Anda.
          </p>
        </header>

        <div className="home-content">
          <p>
            Temukan buku-buku terbaik di bidang 
            <i> Software Engineering</i>, 
            <i> Data Science</i>, 
            <i> Cybersecurity</i>, dan lainnya.
          </p>
          
          {/* Tombol Login/Register (yang berlebihan) sudah dihapus */}
        </div>
      </div>
    </>
  );
};

export default HomePage;