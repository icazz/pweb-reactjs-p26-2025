// src/pages/Genres/ManageGenresPage.tsx
import React, { useState, useEffect } from 'react';
import {
  getGenresService,
  createGenreService,
  updateGenreService,
  deleteGenreService
} from '../../services/bookService';
import type { Genre } from '../../types/book.types';
import './Genres.css'; // Kita akan buat file CSS ini

const ManageGenresPage: React.FC = () => {
  // State untuk data
  const [genres, setGenres] = useState<Genre[]>([]);
  
  // State untuk UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Form Tambah
  const [newGenreName, setNewGenreName] = useState('');
  
  // State untuk Form Edit
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  // Fungsi untuk mengambil semua genre
  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGenresService();
      setGenres(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat genre');
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchGenres();
  }, []);

  // Handler untuk Tambah Genre
  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreName.trim()) {
      setError('Nama genre tidak boleh kosong.');
      return;
    }
    
    try {
      await createGenreService(newGenreName);
      setNewGenreName(''); // Kosongkan input
      fetchGenres(); // Ambil ulang daftar genre
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handler untuk Hapus Genre
  const handleDeleteGenre = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus genre ini? Buku terkait tidak akan terhapus.')) {
      try {
        await deleteGenreService(id);
        fetchGenres(); // Ambil ulang daftar genre
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // Handler untuk Mulai Edit
  const handleEditClick = (genre: Genre) => {
    setEditingGenre({ ...genre });
  };

  // Handler untuk Simpan Edit
  const handleSaveEdit = async () => {
    if (!editingGenre || !editingGenre.name.trim()) {
      setError('Nama genre tidak boleh kosong.');
      return;
    }

    try {
      await updateGenreService(editingGenre.id, editingGenre.name);
      setEditingGenre(null); // Tutup mode edit
      fetchGenres(); // Ambil ulang daftar genre
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Render Tampilan ---
  if (loading) return <div className="loading-state">Loading genres...</div>;

  return (
    <div className="genre-manage-container">
      <h2>Kelola Genre</h2>

      {/* Tampilkan Error State */}
      {error && <div className="error-state">{error}</div>}

      {/* Form Tambah Genre */}
      <form onSubmit={handleAddGenre} className="genre-form add-form">
        <input
          type="text"
          placeholder="Nama genre baru..."
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
        />
        <button type="submit">Tambah Genre</button>
      </form>

      {/* Daftar Genre */}
      <div className="genre-list">
        {genres.length === 0 ? (
          <p>Belum ada genre.</p>
        ) : (
          genres.map((genre) => (
            <div key={genre.id} className="genre-item">
              {editingGenre?.id === genre.id ? (
                // --- Tampilan Mode Edit ---
                <div className="genre-form edit-form">
                  <input
                    type="text"
                    value={editingGenre.name}
                    onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                  />
                  <button onClick={handleSaveEdit} className="save-btn">Simpan</button>
                  <button onClick={() => setEditingGenre(null)} className="cancel-btn">Batal</button>
                </div>
              ) : (
                // --- Tampilan Mode Baca ---
                <>
                  <span className="genre-name">{genre.name}</span>
                  <div className="genre-actions">
                    <button onClick={() => handleEditClick(genre)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteGenre(genre.id)} className="delete-btn">Hapus</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageGenresPage;