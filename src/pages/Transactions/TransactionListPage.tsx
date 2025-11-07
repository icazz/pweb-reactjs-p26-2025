// src/pages/Transactions/TransactionListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// TODO: Import transactionService
// TODO: Import tipe Transaction dari types

const TransactionListPage: React.FC = () => {
  // TODO: Buat state untuk:
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // TODO: Buat state untuk fitur (Requirement):
  // const [searchId, setSearchId] = useState('');
  // const [sortOrder, setSortOrder] = useState(''); // (order by id, amount, price)
  // const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // TODO: Buat fungsi async 'fetchTransactions'
    // 1. Set loading = true
    // 2. Siapkan 'params' (searchId, sortOrder, currentPage)
    // 3. Panggil 'getTransactionsService(params)' dari transactionService
    // 4. Set 'transactions' dengan data hasil fetch
    // 5. Set loading = false
    // 6. Gunakan 'catch' untuk setError
    // 7. Cek jika data.length === 0 untuk empty state
    // Panggil 'fetchTransactions' di sini
  }, [/* Tambahkan dependencies: searchId, sortOrder, currentPage */]);

  // TODO: Handle Loading State (Requirement)
  // if (loading) return <p>Loading...</p>;

  // TODO: Handle Error State (Requirement)
  // if (error) return <p>Error: {error}</p>;

  // TODO: Handle Empty State (Requirement)
  // if (transactions.length === 0) return <p>Belum ada riwayat transaksi.</p>;

  return (
    <div>
      <h2>Riwayat Transaksi</h2>
      
      {/* TODO: Buat komponen UI untuk Search (by ID), Sort (by id, amount, price) */}
      
      <div className="transaction-list">
        {/* TODO: Loop (map) 'transactions' dan render setiap transaksi */}
        {/* transactions.map(tx => (
          <div key={tx.id}>
            <p>ID Transaksi: {tx.id}</p>
            <p>Tanggal: {tx.transaction_date}</p>
            <p>Total: {tx.total_amount}</p>
            <Link to={`/transactions/${tx.id}`}>Lihat Detail</Link>
          </div>
        ))
        */}
      </div>
      
      {/* TODO: Buat komponen UI untuk Pagination */}
    </div>
  );
};

export default TransactionListPage;

// src/pages/Transactions/TransactionListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTransactions } from '../../services/transactionService';

type BookGenre = { id: string; name: string } | null;
type Book = { id: string; title: string; price?: number; publicationYear?: number; genre?: BookGenre };
type OrderItem = { id: string; quantity: number; bookId: string; book?: Book };
type Transaction = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  orderItems?: OrderItem[];
  // optional: total/amount field if backend returns it
  total?: number;
};

const TransactionListPage: React.FC = () => {
  const navigate = useNavigate();

  // Redirect if not logged in (protected)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth/login');
  }, [navigate]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchId, setSearchId] = useState('');
  const [sortOrder, setSortOrder] = useState<'id' | 'amount' | 'price' | ''>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [metaTotal, setMetaTotal] = useState<number>(0);

  useEffect(() => {
    const abort = new AbortController();
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTransactions({
          page: currentPage,
          limit,
          searchId: searchId || undefined,
          sort: sortOrder || undefined,
        });
        // expected res: { success, data, meta }
        if (!res.success) throw new Error(res.message || 'Gagal mengambil data');
        setTransactions(res.data || []);
        setMetaTotal(res.meta?.total || 0);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    return () => abort.abort();
  }, [searchId, sortOrder, currentPage, limit]);

  // UI helpers
  const totalPages = Math.max(1, Math.ceil(metaTotal / limit));

  return (
    <div className="transaction-page container">
      <h2>Riwayat Transaksi</h2>

      {/* Controls */}
      <div className="controls" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Cari ID transaksi..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.trim())}
          aria-label="search-id"
        />

        <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value as any); setCurrentPage(1); }}>
          <option value="">Urutkan (default)</option>
          <option value="id">Order by ID</option>
          <option value="amount">Order by Amount</option>
          <option value="price">Order by Price</option>
        </select>

        <button onClick={() => { setSearchId(''); setSortOrder(''); setCurrentPage(1); }}>Reset</button>
      </div>

      {/* Loading / Error / Empty */}
      {loading && <p>Loading transaksi...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && transactions.length === 0 && <p>Belum ada riwayat transaksi.</p>}

      {/* List */}
      <div className="transaction-list" style={{ display: 'grid', gap: 12 }}>
        {transactions.map((tx) => (
          <div key={tx.id} className="transaction-card" style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <p><strong>ID:</strong> {tx.id}</p>
            <p><strong>Tanggal:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
            <p><strong>Total (opsional):</strong> {tx.total ?? tx.orderItems?.reduce((s, it) => s + ((it.book?.price ?? 0) * (it.quantity || 0)), 0)}</p>
