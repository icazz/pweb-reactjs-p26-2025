// src/pages/Books/BookListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooksService, deleteBookService } from '../../services/bookService';
// Pastikan 'Genre' juga di-import
import type { Book, Genre, PaginatedResponse } from '../../types/book.types';
import './Books.css'; // Import CSS

const BookListPage: React.FC = () => {
  // ... (Semua state Anda sudah benar) ...
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderByTitle, setOrderByTitle] = useState<'asc' | 'desc' | ''>('');
  const [orderByPublishDate, setOrderByPublishDate] = useState<'asc' | 'desc' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ... (Fungsi fetchBooks Anda sudah benar) ...
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: search || undefined,
        orderByTitle: orderByTitle || undefined,
        orderByPublishDate: orderByPublishDate || undefined,
      };
      
      const response: PaginatedResponse<Book> = await getAllBooksService(params);
      
      setBooks(response.data);
      if (response.meta && response.meta.total) {
        setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
      } else {
        setTotalPages(response.meta.next_page ? currentPage + 1 : currentPage);
      }
      
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data buku');
    } finally {
      setLoading(false);
    }
  };

  // ... (useEffect Anda sudah benar) ...
  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, orderByTitle, orderByPublishDate]);

  // ... (Fungsi handleDeleteBook Anda sudah benar) ...
  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await deleteBookService(id);
        fetchBooks(); 
      } catch (err: any) {
        setError(err.message || 'Gagal menghapus buku');
      }
    }
  };

  // ... (Render loading/error Anda sudah benar) ...
  if (loading) return <div className="loading-state">Loading buku...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="book-list-container">
      {/* ... (Header dan filter Anda sudah benar) ... */}
      <div className="book-list-header">
        <h2>Daftar Buku</h2>
        <Link to="/books/add" className="add-book-link">Tambah Buku</Link>
      </div>
      <div className="filters-container">
        <input type="text" placeholder="Cari judul atau penulis..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={orderByTitle} onChange={(e) => setOrderByTitle(e.target.value as any)}>
          <option value="">Sortir Judul</option>
          <option value="asc">Judul (A-Z)</option>
          <option value="desc">Judul (Z-A)</option>
        </select>
        <select value={orderByPublishDate} onChange={(e) => setOrderByPublishDate(e.target.value as any)}>
          <option value="">Sortir Tanggal Terbit</option>
          <option value="asc">Terbaru</option>
          <option value="desc">Terlama</option>
        </select>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">Tidak ada buku yang ditemukan.</div>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-content">
                  <h3>{book.title}</h3>
                  <p>oleh {book.writer}</p>
                  <p className="book-price">
                    Rp {book.price.toLocaleString('id-ID')}
                  </p>
                  <p>Stok: {book.stock_quantity}</p>
                  
                  {/* --- REVISI KUNCI DI SINI --- */}
                  <p>Genre: {book.genre.name}</p> 
                  {/* ----------------------------- */}

                </div>
                <div className="book-card-actions">
                  {/* ... (Tombol Anda sudah benar) ... */}
                  <Link to={`/books/${book.id}`} className="view-details-link">Lihat Detail</Link>
                  <button onClick={() => handleDeleteBook(book.id)} className="delete-book-btn">Hapus</button>
                </div>
              </div>
            ))}
          </div>
          {/* ... (Pagination Anda sudah benar) ... */}
        </>
      )}
    </div>
  );
};

export default BookListPage;