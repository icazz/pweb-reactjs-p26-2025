import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooksService, deleteBookService } from '../../services/bookService';
import type { Book, PaginatedResponse } from '../../types/book.types';
import './Books.css'; // Import CSS

const BookListPage: React.FC = () => {
  // State untuk data
  const [books, setBooks] = useState<Book[]>([]);
  
  // State untuk UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Fitur (Search, Filter, Sort, Pagination) [cite: 73]
  const [search, setSearch] = useState('');
  const [orderByTitle, setOrderByTitle] = useState<'asc' | 'desc' | ''>('');
  const [orderByPublishDate, setOrderByPublishDate] = useState<'asc' | 'desc' | ''>('');
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fungsi untuk mengambil data buku
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10, // Tentukan limit per halaman
        search: search || undefined,
        orderByTitle: orderByTitle || undefined,
        orderByPublishDate: orderByPublishDate || undefined,
      };
      
      const response: PaginatedResponse<Book> = await getAllBooksService(params);
      
      setBooks(response.data);
      // Hitung total halaman dari meta
      setTotalPages(response.meta.next_page ? currentPage + 1 : currentPage); // Ini asumsi, idealnya API mengembalikan total_pages
      
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data buku');
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat atau saat filter/pagination berubah
  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, orderByTitle, orderByPublishDate]); // Dependencies

  // Handler untuk hapus buku [cite: 77]
  const handleDeleteBook = async (id: string) => {
    // Konfirmasi sebelum hapus [cite: 77]
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await deleteBookService(id);
        // Refresh daftar buku setelah berhasil hapus
        fetchBooks(); 
      } catch (err: any) {
        setError(err.message || 'Gagal menghapus buku');
      }
    }
  };

  // --- Render Tampilan ---

  if (loading) {
    return <div className="loading-state">Loading buku...</div>;
  }

  // 2. Tampilkan Error State [cite: 86]
  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>Daftar Buku</h2>
        <Link to="/books/add" className="add-book-link">Tambah Buku</Link>
      </div>

      {/* Kontrol Filter & Search */}
      <div className="filters-container">
        <input 
          type="text"
          placeholder="Cari judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      [cite_start]{/* 3. Tampilkan Empty State atau Grid Buku [cite: 86] */}
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
                  <p>Genre: {book.genre}</p>
                </div>
                <div className="book-card-actions">
                  <Link to={`/books/${book.id}`} className="view-details-link">
                    Lihat Detail
                  </Link>
                  <button 
                    onClick={() => handleDeleteBook(book.id)} 
                    className="delete-book-btn"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button 
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </button>
            <span>Halaman {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages} // Asumsi
            >
              Berikutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookListPage;