// src/pages/Transactions/TransactionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// TODO: Import transactionService
// TODO: Import tipe Transaction dari types

const TransactionDetailPage: React.FC = () => {
  // TODO: Ambil 'id' dari URL
  // const { id } = useParams<{ id: string }>();
  
  // TODO: Buat state untuk:
  // const [transaction, setTransaction] = useState<Transaction | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Pastikan 'id' ada
    // 1. Buat fungsi async 'fetchTransactionDetail'
    // 2. Set loading = true
    // 3. Panggil 'getTransactionByIdService(id)'
    // 4. Set 'transaction' dengan data hasil fetch
    // 5. Set loading = false
    // 6. Gunakan 'catch' untuk setError
    // Panggil 'fetchTransactionDetail' di sini
  }, [/* dependency: id */]);

  // TODO: Handle Loading dan Error state

  return (
    <div>
      <h2>Detail Transaksi</h2>
      
      {/* TODO: Tampilkan detail utama transaksi */}
      {/* <p>ID Transaksi: {transaction.id}</p>
      <p>Tanggal: {transaction.transaction_date}</p>
      <h3>Total Belanja: {transaction.total_amount}</h3>
      */}

      <h3>Item yang Dibeli:</h3>
      <div className="item-list">
        {/* TODO: Loop (map) 'transaction.items' */}
        {/* transaction.items.map(item => (
          <div key={item.book.id}>
            <p>Buku: {item.book.title}</p>
            <p>Jumlah: {item.quantity}</p>
            <p>Harga per item: {item.price_per_item}</p>
          </div>
        ))
        */}
      </div>
    </div>
  );
};

export default TransactionDetailPage;

// src/pages/Transactions/TransactionDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById } from '../../services/transactionService';

type BookGenre = { id: string; name: string } | null;
type Book = { id: string; title: string; price?: number; publicationYear?: number; genre?: BookGenre; stockQuantity?: number };
type OrderItem = { id: string; quantity: number; bookId: string; book?: Book };
type Transaction = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  orderItems?: OrderItem[];
  total?: number;
};

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth/login');
  }, [navigate]);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Transaction ID tidak ditemukan di URL');
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchTransactionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTransactionById(id);
        if (!res.success) {
          throw new Error(res.message || 'Gagal mengambil detail transaksi');
        }
        if (!cancelled) setTransaction(res.data);
      } catch (err: any) {
        setError(err.message || 'Server error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTransactionDetail();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p>Loading detail transaksi...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!transaction) return <p>Transaksi tidak ditemukan.</p>;

  const totalCalculated = transaction.total ?? transaction.orderItems?.reduce((s, it) => s + ((it.book?.price ?? 0) * (it.quantity || 0)), 0);

  return (
    <div className="transaction-detail container">
      <h2>Detail Transaksi</h2>
      <p><strong>ID Transaksi:</strong> {transaction.id}</p>
      <p><strong>Tanggal:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
      <h3>Total Belanja: Rp {Number(totalCalculated).toLocaleString()}</h3>

      <h3>Item yang Dibeli:</h3>
      <div className="item-list" style={{ display: 'grid', gap: 12 }}>
        {transaction.orderItems?.map(item => (
          <div key={item.id} style={{ padding: 10, border: '1px solid #eee', borderRadius: 8 }}>
            <p><strong>Buku:</strong> {item.book?.title ?? item.bookId}</p>
            <p><strong>Jumlah:</strong> {item.quantity}</p>
            <p><strong>Harga per item:</strong> Rp {(item.book?.price ?? 0).toLocaleString()}</p>
            <p><strong>Subtotal:</strong> Rp {((item.book?.price ?? 0) * (item.quantity || 0)).toLocaleString()}</p>
            <p><strong>Genre:</strong> {item.book?.genre?.name ?? '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
