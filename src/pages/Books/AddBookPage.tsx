// src/pages/Books/AddBookPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBookService, getGenresService } from '../../services/bookService';
import type { Genre } from '../../types/book.types'; // Hapus NewBookData, kita pakai FormData
import './Books.css'; 

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();

  // State untuk form teks
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [publisher, setPublisher] = useState('');
  
  // State untuk form angka (disimpan sebagai string untuk perbaikan bug)
  const [publicationYear, setPublicationYear] = useState<string>(String(new Date().getFullYear()));
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  
  const [genreId, setGenreId] = useState('');
  const [description, setDescription] = useState('');
  
  // State untuk file gambar
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State untuk UI
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenresService();
        setGenres(response.data);
      } catch (err: any) {
        setError('Gagal memuat genre. Coba refresh halaman.');
      }
    };
    fetchGenres();
  }, []);

  // Fungsi handleSubmit yang sudah diperbaiki
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- 1. VALIDASI DULU ---
    if (!title || !writer || !publisher || !genreId || !publicationYear || !price || !stock) {
      setError('Field dengan tanda * wajib diisi.');
      setLoading(false);
      return;
    }

    // Ganti koma (,) dengan titik (.) agar JavaScript paham
    const priceString = price.replace(',', '.');
    const stockString = stock.replace(',', '.');
    const yearString = publicationYear.replace(',', '.');

    const numPrice = parseFloat(priceString); // Boleh desimal
    const numStock = parseInt(stockString, 10); // Harus integer
    const numYear = parseInt(yearString, 10); // Harus integer

    // Validasi numerik
    if (numPrice <= 0) {
      setError('Harga tidak boleh 0 atau minus.');
      setLoading(false);
      return;
    }
    if (numStock <= 0 || parseFloat(stockString) !== numStock) {
      setError('Stok harus bilangan bulat positif (tidak boleh 0, minus, atau desimal).');
      setLoading(false);
      return;
    }
    if (numYear <= 0 || parseFloat(yearString) !== numYear) {
      setError('Tahun terbit harus bilangan bulat positif.');
      setLoading(false);
      return;
    }
    if (numYear > currentYear) {
      setError('Tahun terbit tidak boleh lebih dari tahun sekarang.');
      setLoading(false);
      return;
    }
    // --- AKHIR VALIDASI ---

    // --- 2. BUAT FORMDATA SETELAH VALIDASI ---
    const formData = new FormData();
    formData.append('title', title);
    formData.append('writer', writer);
    formData.append('publisher', publisher);
    formData.append('publicationYear', yearString); // Kirim string yang sudah divalidasi
    formData.append('price', priceString); // Kirim string yang sudah divalidasi
    formData.append('stockQuantity', stockString); // Kirim string yang sudah divalidasi
    formData.append('genreId', genreId);
    formData.append('description', description);

    if (imageFile) {
      formData.append('book_image', imageFile);
    }
    
    try {
      // --- 3. KIRIM FORMDATA ---
      await createBookService(formData); 
      setLoading(false);
      alert('Buku berhasil ditambahkan!');
      navigate('/books');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Gagal menambahkan buku');
    }
  };

  return (
    <div className="book-form-container">
      <h2>Tambah Buku Baru</h2>

      {error && (
        <div className="error-state" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Judul Buku *</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="writer">Penulis *</label>
          <input id="writer" type="text" value={writer} onChange={(e) => setWriter(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="publisher">Penerbit *</label>
          <input id="publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre *</label>
          <select id="genre" value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
            <option value="" disabled>Pilih Genre...</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="publicationYear">Tahun Terbit *</label>
          <input
            id="publicationYear"
            type="number" // Tetap type="number" untuk UI (panah)
            step="1"
            max={currentYear}
            min="1800"
            placeholder="Contoh: 2025"
            value={publicationYear}
            onChange={(e) => {
              // Hapus semua karakter non-angka (termasuk -, +, e, E, .)
              const value = e.target.value.replace(/[^0-9]/g, '');
              setPublicationYear(value);
            }}
            required
            onKeyDown={(e) => {
              if (e.key === '-') {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Harga *</label>
          <input
            id="price"
            type="number"
            min="0"
            step="1000"
            placeholder="Contoh: 50000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            onKeyDown={(e) => {
              if (e.key === '-') {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stok *</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Contoh: 10"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === '.' || e.key === ',') {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Gambar Buku (Opsional)</label>
          <input
            id="image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              } else {
                setImageFile(null);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Buku'}
        </button>
      </form>
    </div>
  );
};

export default AddBookPage;
