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