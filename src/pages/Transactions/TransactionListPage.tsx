// src/pages/Transactions/TransactionListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAllTransactionsService,
  type TransactionQueryParams
} from '../../services/transactionService';
import type { Transaction } from '../../types/transaction.types';
import './Transactions.css';

const LIMIT = 5;

const TransactionListPage: React.FC = () => {
  const navigate = useNavigate();

  // Protected: kalau tidak ada token redirect ke login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fitur UI state
  const [searchId, setSearchId] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [searchBookId, setSearchBookId] = useState<string>('');
  const [debouncedBookSearch, setDebouncedBookSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>(''); // '', 'id_asc', 'id_desc', 'amount_asc', 'amount_desc', 'price_asc', 'price_desc'
  const [currentPage, setCurrentPage] = useState<number>(1);

  // pagination meta
  const [pageMeta, setPageMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  } | null>(null);

    // Debounce search input (delay 500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchId.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchId]);

  // Debounce untuk Book ID
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBookSearch(searchBookId.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [searchBookId]);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: TransactionQueryParams = {
          page: currentPage,
          limit: LIMIT,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (debouncedBookSearch) {
          params.bookId = debouncedBookSearch;
        }

        if (sortOrder) {
          // map frontend sortOrder to backend sortBy & order
          if (sortOrder.startsWith('id_')) {
            params.sortBy = 'id';
            params.order = sortOrder.endsWith('_asc') ? 'asc' : 'desc';
          } else if (sortOrder.startsWith('amount_')) {
            params.sortBy = 'amount';
            params.order = sortOrder.endsWith('_asc') ? 'asc' : 'desc';
          } else if (sortOrder.startsWith('price_')) {
            params.sortBy = 'price';
            params.order = sortOrder.endsWith('_asc') ? 'asc' : 'desc';
          }
        }

        const resp = await getAllTransactionsService(params);

            if (resp.data && isMounted) {
              setTransactions(resp.data || []);
              setPageMeta(resp.meta || null);
            } else if (isMounted) {
              setTransactions([]);
              setPageMeta(null);
            }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Gagal mengambil data transaksi.');
          setTransactions([]);
          setPageMeta(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, debouncedBookSearch, sortOrder]);

  // UI handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchId('');
    setCurrentPage(1);
    setSortOrder('');
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1) return;
    if (pageMeta && pageMeta.totalPages && page > pageMeta.totalPages) return;
    setCurrentPage(page);
  };

  // Loading / Error / Empty states
  if (loading) return <p>Loading riwayat transaksi...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
      <div className="transaction-container">
        <div className="transaction-header">
          <h2>Riwayat Transaksi</h2>
          <div>
            <Link to="/transactions/checkout" className="add-book-link">Buat Transaksi</Link>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="transaction-filters">
        <input
          placeholder="Cari by ID transaksi..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          placeholder="Cari by Book ID..."
          value={searchBookId}
          onChange={(e) => setSearchBookId(e.target.value)}
        />
        <button type="submit">Cari</button>
        <button type="button" onClick={handleClearSearch}>Clear</button>

          <select value={sortOrder} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="">Urutkan</option>
          <option value="id_asc">ID ↑</option>
          <option value="id_desc">ID ↓</option>
          <option value="amount_asc">Jumlah Barang ↑</option>
          <option value="amount_desc">Jumlah Barang ↓</option>
          <option value="price_asc">Total Harga ↑</option>
          <option value="price_desc">Total Harga ↓</option>
        </select>
      </form>

      <div className="transaction-list">
        {transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
            <p><strong>ID Transaksi:</strong> {tx.id}</p>
            <p><strong>Jumlah Item:</strong> {tx.total_quantity || 0}</p>
            <p><strong>Total Harga:</strong> Rp {(tx.total_price || 0).toLocaleString()}</p>
            <Link to={`/transactions/${tx.id}`}>Lihat Detail</Link>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
        <div className="pagination-container">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>Halaman {currentPage}</span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!!(pageMeta && pageMeta.totalPages !== undefined && currentPage >= (pageMeta.totalPages || 0))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionListPage;
