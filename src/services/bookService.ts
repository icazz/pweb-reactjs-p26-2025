import api from './api';
// 1. Tambahkan UpdateBookData ke impor
import type { Book, Genre, NewBookData, PaginatedResponse, UpdateBookData } from '../types/book.types';

// Tipe untuk parameter query
type BookQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  orderByTitle?: 'asc' | 'desc';
  orderByPublishDate?: 'asc' | 'desc';
  condition?: string; // Sesuai PDF [cite: 30]
};

// Mengambil semua buku dengan parameter query
export const getAllBooksService = async (params: BookQueryParams): Promise<PaginatedResponse<Book>> => {
  const response = await api.get('/books', { params });
  if (response.data.success) {
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  } else {
    throw new Error(response.data.message || 'Gagal mengambil data buku');
  }
};

// *** 2. FUNGSI BARU (Get Books By Genre) ***
// Sesuai requirement GET /books/genre/:genre_id 
export const getBooksByGenreService = async (genreId: string, params: BookQueryParams): Promise<PaginatedResponse<Book>> => {
  const response = await api.get(`/books/genre/${genreId}`, { params });
  if (response.data.success) {
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  } else {
    throw new Error(response.data.message || 'Gagal mengambil data buku berdasarkan genre');
  }
};

// Mengambil satu buku berdasarkan ID
export const getBookByIdService = async (id: string): Promise<Book> => {
  const response = await api.get(`/books/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal mengambil detail buku');
  }
};

// Membuat buku baru
export const createBookService = async (bookData: NewBookData): Promise<any> => {
  const response = await api.post('/books', bookData);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal menambah buku');
  }
};

// *** 3. FUNGSI BARU (Update Book) ***
// Sesuai requirement PATCH /books/:book_id 
export const updateBookService = async (id: string, bookData: UpdateBookData): Promise<any> => {
  const response = await api.patch(`/books/${id}`, bookData);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal memperbarui buku');
  }
};

// Menghapus buku berdasarkan ID
export const deleteBookService = async (id: string): Promise<void> => {
  const response = await api.delete(`/books/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal menghapus buku');
  }
};

// Mengambil daftar semua genre (untuk dropdown)
export const getGenresService = async (): Promise<PaginatedResponse<Genre>> => {
  // API menggunakan /genre, bukan /genres 
  const response = await api.get('/genre'); 
  if (response.data.success) {
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  } else {
    throw new Error(response.data.message || 'Gagal mengambil data genre');
  }
};