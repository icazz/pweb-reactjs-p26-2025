import api from './api';
import type { Transaction, TransactionDetail, CheckoutItem } from '../types/transaction.types';

// Tipe untuk parameter query [cite: 37]
type TransactionQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  orderById?: 'asc' | 'desc';
  orderByAmount?: 'asc' | 'desc';
  orderByPrice?: 'asc' | 'desc';
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    prev_page: number | null;
    next_page: number | null;
  };
};

// Mengambil rimayat transaksi (milik user)
export const getAllTransactionsService = async (params: TransactionQueryParams): Promise<PaginatedResponse<Transaction>> => {
  const response = await api.get('/transactions', { params });
  if (response.data.success) {
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  } else {
    throw new Error(response.data.message || 'Gagal mengambil data transaksi');
  }
};

// Mengambil satu transaksi berdasarkan
export const getTransactionByIdService = async (id: string): Promise<TransactionDetail> => {
  const response = await api.get(`/transactions/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal mengambil detail transaksi');
  }
};

// Membuat transaksi baru (checkout)
export const createTransactionService = async (items: CheckoutItem[]): Promise<any> => {
  // API Anda tidak perlu user_id, backend akan mengambilnya dari token
  const response = await api.post('/transactions', { items });
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal membuat transaksi');
  }
};