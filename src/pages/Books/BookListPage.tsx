// src/pages/Books/BookListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooksService } from '../../services/bookService';
import type { Book, PaginatedResponse } from '../../types/book.types';
import './Books.css';

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderByTitle, setOrderByTitle] = useState<'asc' | 'desc' | ''>('');
  const [orderByPublishDate, setOrderByPublishDate] = useState<'asc' | 'desc' | ''>('');
  const [filterCondition, setFilterCondition] = useState<'all' | 'available' | 'outofstock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 8,
        search: search || undefined,
        orderByTitle: orderByTitle || undefined,
        orderByPublishDate: orderByPublishDate || undefined,
        condition: filterCondition !== 'all' ? filterCondition : undefined,
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

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, orderByTitle, orderByPublishDate, filterCondition]);

  if (loading) return <div className="loading-state">Loading buku...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="book-list-container">
      {/* Header */}
      <div className="book-list-header">
        <h2>Daftar Buku</h2>
        <div className="header-actions">
          <Link to="/genres" className="manage-genre-link">Kelola Genre</Link>
          <Link to="/admin/books" className="add-book-link">Kelola Buku</Link>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Cari judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value as any)}>
        <option value="all">Semua Buku</option>
        <option value="available">Tersedia </option>
        <option value="outofstock">Habis </option>
      </select>


        <select value={orderByTitle} onChange={(e) => setOrderByTitle(e.target.value as any)}>

          <option value="asc">Judul (A-Z)</option>
          <option value="desc">Judul (Z-A)</option>
        </select>

        <select value={orderByPublishDate} onChange={(e) => setOrderByPublishDate(e.target.value as any)}>
          <option value="">Sortir Tanggal Terbit</option>
          <option value="asc">Terbaru</option>
          <option value="desc">Terlama</option>
        </select>
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="empty-state">Tidak ada buku yang ditemukan.</div>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                {book.book_image ? (
                  <img
                    src={`http://localhost:8080${book.book_image}`}
                    alt={book.title}
                    className="book-card-image"
                  />
                ) : (
                  <div className="book-card-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}

                <div className="book-card-content">
                  <h3>{book.title}</h3>
                  <p>oleh {book.writer}</p>
                  <p className="book-price">Rp {book.price.toLocaleString('id-ID')}</p>
                  <p>Stok: {book.stockQuantity}</p>
                  <p>Genre: {book.genre?.name || '-'}</p>
                </div>

                <div className="book-card-actions">
                  <Link to={`/books/${book.id}`} className="view-details-link">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              « Sebelumnya
            </button>

            <span>
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Selanjutnya »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookListPage;
