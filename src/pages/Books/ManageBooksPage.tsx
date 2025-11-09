// src/pages/Books/ManageBooksPage.tsx
// Halaman ini adalah Halaman Admin untuk CRUD
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooksService, deleteBookService } from '../../services/bookService';
import type { Book, PaginatedResponse, Genre } from '../../types/book.types';
import './Books.css'; // Kita gunakan CSS yang sama

const ManageBooksPage: React.FC = () => {
  // State untuk data
  const [books, setBooks] = useState<Book[]>([]);
  
  // State untuk UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Fitur (Search, Filter, Sort, Pagination)
  const [search, setSearch] = useState('');
  const [orderByTitle, setOrderByTitle] = useState<'asc' | 'desc' | ''>('');
  const [orderByPublishDate, setOrderByPublishDate] = useState<'asc' | 'desc' | ''>('');
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- 1. FUNGSI LENGKAP UNTUK FETCH BUKU ---
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
      // Hitung total halaman dari meta (lebih akurat)
      if (response.meta && response.meta.total && response.meta.limit) {
        setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
      } else if (response.meta) {
        // Fallback jika 'total' tidak ada
        setTotalPages(response.meta.next_page ? currentPage + 1 : currentPage);
      }
      
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

  // --- 2. FUNGSI LENGKAP UNTUK HAPUS BUKU ---
  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await deleteBookService(id);
        fetchBooks(); // Refresh daftar buku
      } catch (err: any) {
        setError(err.message || 'Gagal menghapus buku');
      }
    }
  };

  // --- Render Tampilan ---
  if (loading) return <div className="loading-state">Loading buku...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>Kelola Buku</h2> 
        <div className="header-actions">
          <Link to="/genres" className="manage-genre-link">Kelola Genre</Link>
          <Link to="/books/add" className="add-book-link">Tambah Buku</Link>
        </div>
      </div>

      {/* --- Filter --- */}
      <div className="filters-container">
        {/* ... (Kode filter Anda sudah benar) ... */}
      </div>

      {books.length === 0 ? (
        <div className="empty-state">Tidak ada buku yang ditemukan.</div>
      ) : (
        <>
          {/* --- REVISI: Ganti Grid menjadi List View --- */}
          <div className="book-list-view">
            {books.map((book) => (
              <div key={book.id} className="book-list-item">
                
                {/* 1. Gambar (Thumbnail) */}
                {book.book_image ? (
                  <img src={`http://localhost:8080${book.book_image}`} alt={book.title} className="list-item-image" />
                ) : (
                  <div className="list-item-image-placeholder"><span>No Img</span></div>
                )}

                {/* 2. Info Buku */}
                <div className="list-item-info">
                  <h3>{book.title}</h3>
                  <p>oleh {book.writer} | Genre: {book.genre.name}</p>
                  <span className="list-item-price">Rp {book.price.toLocaleString('id-ID')}</span>
                  <span className="list-item-stock">(Stok: {book.stockQuantity})</span>
                </div>
                
                {/* 3. Tombol Aksi */}
                <div className="list-item-actions">
                  <Link to={`/books/${book.id}`} className="action-btn-detail">Detail</Link>
                  <Link to={`/books/edit/${book.id}`} className="action-btn-edit">Edit</Link>
                  <button 
                    onClick={() => handleDeleteBook(book.id)} 
                    className="action-btn-delete"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* --- AKHIR REVISI --- */}
          
          {/* ... (Pagination Anda sudah benar) ... */}
        </>
      )}
    </div>
  );
};

export default ManageBooksPage;