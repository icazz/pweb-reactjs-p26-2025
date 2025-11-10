// src/pages/Books/EditBookPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookByIdService, updateBookService, getGenresService } from '../../services/bookService';
import type { Genre, Book } from '../../types/book.types'; 
import './Books.css'; 

const EditBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  
  // State untuk semua field
  const [originalTitle, setOriginalTitle] = useState('');
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [genreId, setGenreId] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  
  // Mengambil data buku dan genre
  useEffect(() => {
    if (!id) {
      setError('ID buku tidak ditemukan.');
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        const [bookData, genreResponse] = await Promise.all([
          getBookByIdService(id),
          getGenresService()
        ]);
        
        // Isi form dengan data yang ada
        setTitle(bookData.title);
        setOriginalTitle(bookData.title);
        setWriter(bookData.writer);
        setPublisher(bookData.publisher);
        setPublicationYear(String(bookData.publicationYear));
        setPrice(String(bookData.price));
        setStock(String(bookData.stockQuantity));
        setDescription(bookData.description || '');
        setGenreId(bookData.genre.id); 
        setCurrentImage(bookData.book_image || null);
        setGenres(genreResponse.data);
        
      } catch (err: any) {
        setError('Gagal memuat data untuk diedit.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // handleSubmit yang direvisi untuk update opsional
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);

    // --- REVISI VALIDASI ---
    // Validasi hanya jika field diisi (tidak kosong)
    
    const priceString = price.replace(',', '.');
    const stockString = stock.replace(',', '.');
    const yearString = publicationYear.replace(',', '.');

    // Konversi, biarkan NaN jika string kosong
    const numPrice = priceString ? parseFloat(priceString) : NaN;
    const numStock = stockString ? parseInt(stockString, 10) : NaN;
    const numYear = yearString ? parseInt(yearString, 10) : NaN;

    // Validasi numerik HANYA JIKA diisi
    if (priceString && numPrice <= 0) {
      setError('Harga tidak boleh 0 atau minus.');
      setLoading(false); return;
    }
    if (stockString && (numStock <= 0 || parseFloat(stockString) !== numStock)) {
      setError('Stok harus bilangan bulat positif.');
      setLoading(false); return;
    }
    if (yearString && (numYear <= 0 || parseFloat(yearString) !== numYear)) {
      setError('Tahun terbit harus bilangan bulat positif.');
      setLoading(false); return;
    }
    if (yearString && numYear > currentYear) {
      setError('Tahun terbit tidak boleh lebih dari tahun sekarang.');
      setLoading(false); return;
    }
    // --- AKHIR VALIDASI ---

    // Buat FormData untuk update
    // Backend akan menangani field mana yang di-update
    const formData = new FormData();
    formData.append('title', title);
    formData.append('writer', writer);
    formData.append('publisher', publisher);
    formData.append('publicationYear', yearString);
    formData.append('price', priceString);
    formData.append('stockQuantity', stockString);
    formData.append('genreId', genreId);
    formData.append('description', description);
    
    if (imageFile) {
      formData.append('book_image', imageFile);
    }

    try {
      await updateBookService(id, formData);
      setLoading(false);
      alert('Buku berhasil diperbarui!');
      navigate('/admin/books'); // Kembali ke halaman kelola buku
    
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui buku');
    }
  };

  if (loading) {
    return <div className="loading-state">Memuat data buku...</div>
  }

  return (
    <div className="book-form-container">
      <h2>Edit Buku: {originalTitle}</h2>
      
      {error && (
        <div className="error-state" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* --- REVISI FORM (Hapus '*' dan 'required') --- */}
      <form onSubmit={handleSubmit} className="book-form">
        
        {currentImage && (
          <div className="form-group">
            <label>Gambar Saat Ini:</label>
            <img src={`http://localhost:8080${currentImage}`} alt="Current" style={{width: '150px', height: 'auto', borderRadius: '4px'}} />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="image">Upload Gambar Baru (Opsional)</label>
          <input id="image" type="file" accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
              else setImageFile(null);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Judul Buku</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="writer">Penulis</label>
          <input id="writer" type="text" value={writer} onChange={(e) => setWriter(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="publisher">Penerbit</label>
          <input id="publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select id="genre" value={genreId} onChange={(e) => setGenreId(e.target.value)}>
            <option value="" disabled>Pilih Genre...</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="publicationYear">Tahun Terbit</label>
          <input id="publicationYear" type="number" step="1" max={currentYear}
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Harga</label>
          <input id="price" type="text" inputMode="decimal"
            value={price}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9,.]/g, '');
              value = value.replace(/([,.].*)[,.]/g, '$1'); 
              setPrice(value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stok</label>
          <input id="stock" type="number" step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;