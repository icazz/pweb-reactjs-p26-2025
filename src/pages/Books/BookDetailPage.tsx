// src/pages/Books/BookDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookByIdService } from '../../services/bookService';
import type { Book, Genre } from '../../types/book.types'; // Pastikan tipe Anda menyertakan 'book_image'
import { useAuth } from '../../contexts/AuthContext'; // 2. IMPORT useAuth
import { useCart } from '../../contexts/CartContext';
import './Books.css';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return; 
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookByIdService(id);
        setBook(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil detail buku');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

const handleAddToCart = () => {
    if (!book) return;
    
    // Validasi kuantitas
    if (quantity > book.stockQuantity) {
      alert("Stok tidak mencukupi!");
      return;
    }
    if (quantity <= 0) {
      alert("Jumlah tidak valid");
      return;
    }

    addToCart(book, quantity);
    alert(`${quantity} x "${book.title}" berhasil ditambahkan ke keranjang!`);
  };

  if (loading) return <div className="loading-state">Loading detail buku...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!book) return <div className="empty-state">Buku tidak ditemukan.</div>;

  return (
    // Kontainer utama
    <div className="book-detail-container">
      
      {/* --- REVISI 1: Header (Gambar + Info Utama) --- */}
      <div className="book-detail-header">
        
        {/* Wrapper untuk Gambar */}
        <div className="book-detail-image-wrapper">
          {book.book_image ? (
            <img 
              src={`http://localhost:8080${book.book_image}`} 
              alt={book.title} 
              className="book-detail-image"
            />
          ) : (
            <div className="book-detail-image-placeholder">
              <span>No Image</span>
            </div>
          )}
        </div>
        
        {/* Wrapper untuk Info Utama */}
        <div className="book-detail-info">
          <h2>{book.title}</h2>
          
          {/* Grid ini sekarang berisi info utama (kecuali deskripsi) */}
          <div className="book-detail-grid">
            <strong>Penulis:</strong>
            <p>{book.writer}</p>

            <strong>Penerbit:</strong>
            <p>{book.publisher}</p>

            {book.publicationYear && (
              <>
                <strong>Tahun Terbit:</strong>
                <p>{book.publicationYear}</p>
              </>
            )}

            <strong>Genre:</strong>
            <p>{book.genre?.name || 'Tidak diketahui'}</p>

            <strong>Harga:</strong>
            <p>Rp {book.price.toLocaleString('id-ID')}</p>

            <strong>Stok:</strong>
            <p>{book.stockQuantity > 0 ? `${book.stockQuantity} tersisa` : 'Stok Habis'}</p>
          </div>
        </div>
      </div>
      {/* --- AKHIR REVISI 1 --- */}
      
      {/* --- REVISI 2: Pisahkan Deskripsi --- */}
      <div className="book-detail-description">
        <h3>Deskripsi:</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {book.description || 'Tidak ada deskripsi.'}
        </p>
      </div>
      {/* --- AKHIR REVISI 2 --- */}

      {token ? (
        // --- JIKA SUDAH LOGIN (Tampilkan Add to Cart) ---
        <div className="buy-action-container">
          {/* Input Kuantitas */}
          <div className="form-group">
            <label htmlFor="quantity">Jumlah:</label>
            <input 
              id="quantity"
              type="number"
              className="checkout-quantity" // Pinjam style
              value={quantity}
              min="1"
              max={book.stockQuantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              onKeyDown={(e) => { // Blok desimal/minus
                if (e.key === '-' || e.key === '.' || e.key === ',') {
                  e.preventDefault();
                }
              }}
            />
          </div>
          {/* Tombol Add to Cart */}
          <button
              className="form-button"
              disabled={book.stockQuantity === 0}
            onClick={handleAddToCart}
            >
              {book.stockQuantity > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
            </button>
        </div>
      ) : (
        // --- JIKA BELUM LOGIN (Tampilkan Link Login) ---
        <div className="login-prompt-button">
          <Link to="/login">Login untuk Membeli</Link>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;