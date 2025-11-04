// src/pages/Books/BookDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByIdService } from '../../services/bookService';
// 1. Pastikan 'Genre' juga di-import
import type { Book, Genre } from '../../types/book.types';
import './Books.css'; // Import CSS

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="loading-state">Loading detail buku...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!book) return <div className="empty-state">Buku tidak ditemukan.</div>;

  return (
    <div className="book-detail-container">
      <h2>{book.title}</h2>
      
      <div className="book-detail-grid">
        <strong>Penulis:</strong>
        <p>{book.writer}</p>

        <strong>Penerbit:</strong>
        <p>{book.publisher}</p>

        <strong>Tahun Terbit:</strong>
        <p>{book.publication_year}</p>

        {/* --- REVISI KUNCI DI SINI --- */}
        <strong>Genre:</strong>
        <p>{book.genre.name}</p>
        {/* ----------------------------- */}

        <strong>Harga:</strong>
        <p>Rp {book.price.toLocaleString('id-ID')}</p>

        <strong>Stok:</strong>
        <p>{book.stock_quantity > 0 ? `${book.stock_quantity} tersisa` : 'Stok Habis'}</p>

        <strong>Deskripsi:</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {book.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <button 
        className="form-button" 
        style={{ marginTop: '2rem' }}
        disabled={book.stock_quantity === 0}
      >
        {book.stock_quantity > 0 ? 'Beli Sekarang' : 'Stok Habis'}
      </button>
    </div>
  );
};

export default BookDetailPage;