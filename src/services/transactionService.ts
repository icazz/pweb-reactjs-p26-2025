import api from './api';
import type { Transaction, TransactionDetail, CheckoutItem } from '../types/transaction.types';

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
  // backend expects params: page, limit, search, sortBy, order
  const response = await api.get('/transactions', { params });
  if (response.data.success) {
    const respData = response.data.data || [];
    const meta = response.data.meta || { total: 0, page: 1, limit: params.limit || 10 };

    // Normalize each order to frontend Transaction shape
    const normalized: Transaction[] = respData.map((o: any) => ({
      id: o.id,
      total_quantity: o.totalItems ?? o.total_items ?? o.totalItems ?? 0,
      total_price: o.totalPrice ?? o.total_price ?? o.total_price ?? 0,
    }));

    return {
      data: normalized,
      meta: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total || 0,
        totalPages: meta.totalPages ?? Math.ceil((meta.total || 0) / (meta.limit || 1)),
      }
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