import api from './api';
import type { Transaction, TransactionDetail, CheckoutItem, PaginatedResponse } from '../types/transaction.types';

// Tipe untuk parameter query [cite: 37]
export type TransactionQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  bookId?: string;
  sort?: string;
  sortBy?: 'id' | 'amount' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
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
    const o = response.data.data;
    // normalize to TransactionDetail
    const items = (o.items || o.orderItems || []).map((it: any) => ({
      book_id: it.bookId ?? it.book_id ?? it.book?.id,
      book_title: it.book?.title ?? it.book_title ?? '',
      quantity: it.quantity ?? 0,
      subtotal_price: (it.quantity ?? 0) * ((it.book?.price ?? it.subtotal_price ?? 0)),
    }));

    const total_quantity = items.reduce((s: number, it: any) => s + (it.quantity || 0), 0);
    const total_price = items.reduce((s: number, it: any) => s + (it.subtotal_price || 0), 0);

    return {
      id: o.id,
      total_quantity,
      total_price,
      items,
    };
  } else {
    throw new Error(response.data.message || 'Gagal mengambil detail transaksi');
  }
};

// Membuat transaksi baru (checkout)
export const createTransactionService = async (items: CheckoutItem[]): Promise<any> => {
  // Map frontend CheckoutItem { book_id } to backend expected { bookId }
  const payloadItems = items.map(i => ({ bookId: i.book_id ?? (i as any).bookId, quantity: i.quantity }));
  const response = await api.post('/transactions', { items: payloadItems });
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Gagal membuat transaksi');
  }
};