import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBookService, getGenresService } from '../../services/bookService';
import type { Genre, NewBookData } from '../../types/book.types';
import './Books.css'; 

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [genreId, setGenreId] = useState('');
  const [description, setDescription] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const currentYear = new Date().getFullYear();

    // Validasi field wajib
    if (!title || !writer || !publisher || !genreId) {
      setError('Field dengan tanda * wajib diisi.');
      setLoading(false);
      return;
    }

    // Validasi numerik
    if (price <= 0) {
      setError('Harga harus lebih dari 0 dan tidak boleh minus.');
      setLoading(false);
      return;
    }

    if (stock < 0) {
      setError('Stok tidak boleh bernilai negatif.');
      setLoading(false);
      return;
    }

    // ✅ Stok tidak boleh bilangan desimal
    if (!Number.isInteger(stock)) {
      setError('Stok harus berupa bilangan bulat (tanpa koma).');
      setLoading(false);
      return;
    }

    // ✅ Tahun tidak boleh melebihi tahun sekarang
    if (publicationYear > currentYear) {
      setError('Tahun terbit tidak boleh lebih dari tahun sekarang.');
      setLoading(false);
      return;
    }

const newBookData: NewBookData = {
  title,
  writer,
  publisher,
  publicationYear: Number(publicationYear),
  price: Number(price),
  stockQuantity: Number(stock),
  genreId: genreId,
  description: description || undefined,
};


    try {
      await createBookService(newBookData);
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
            type="number"
            value={publicationYear}
            onChange={(e) => setPublicationYear(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Harga *</label>
          <input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stok *</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
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
