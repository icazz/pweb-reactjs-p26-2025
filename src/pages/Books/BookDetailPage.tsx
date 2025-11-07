// src/pages/Books/BookDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByIdService } from '../../services/bookService';
import type { Book, Genre } from '../../types/book.types';
import './Books.css';

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

        {book.publicationYear && (
          <>
            <strong>Tahun Terbit:</strong>
            <p>{book.publicationYear}</p>
          </>
        )}

        <strong>Genre:</strong>
        <p>{book.genre?.name || 'Tidak diketahui'}</p>

        {book.isbn && (
          <>
            <strong>ISBN:</strong>
            <p>{book.isbn}</p>
          </>
        )}

        <strong>Harga:</strong>
        <p>Rp {book.price.toLocaleString('id-ID')}</p>

        <strong>Stok:</strong>
        <p>{book.stockQuantity > 0 ? `${book.stockQuantity} tersisa` : 'Stok Habis'}</p>

        {book.condition && (
          <>
            <strong>Kondisi:</strong>
            <p>{book.condition}</p>
          </>
        )}

        <strong>Deskripsi:</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {book.description || 'Tidak ada deskripsi.'}
        </p>
      </div>

      <button
        className="form-button"
        style={{ marginTop: '2rem' }}
        disabled={book.stockQuantity === 0}
      >
        {book.stockQuantity > 0 ? 'Beli Sekarang' : 'Stok Habis'}
      </button>
    </div>
  );
};

export default BookDetailPage;
