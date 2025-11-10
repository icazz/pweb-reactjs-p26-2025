// src/pages/Transactions/CheckoutPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooksService } from '../../services/bookService';
import { createTransactionService } from '../../services/transactionService';
import type { Book } from '../../types/book.types';
import './Transactions.css'; // Import CSS Transaksi
import '../Books/Books.css'; // <-- 1. PASTIKAN IMPORT INI ADA

type CheckoutRow = {
  book_id: string;
  quantity: number;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [rows, setRows] = useState<CheckoutRow[]>([{ book_id: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resp = await getAllBooksService({ limit: 999 }); 
        setBooks(resp.data || []);
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil daftar buku.');
      }
    };
    fetchBooks();
  }, []);

  const updateRow = (index: number, update: Partial<CheckoutRow>) => {
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, ...update } : r));
  };

  const addRow = () => setRows((prev) => [...prev, { book_id: '', quantity: 1 }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const items = rows
      .filter(r => r.book_id)
      .map(r => ({ book_id: r.book_id, quantity: Number(r.quantity) }));

    if (items.length === 0) {
      setError('Pilih minimal 1 buku untuk checkout.');
      return;
    }
    if (items.some(item => item.quantity <= 0)) {
      setError('Kuantitas buku tidak boleh 0 atau minus.');
      return;
    }

    setLoading(true);
    try {
      await createTransactionService(items);
      alert('Checkout berhasil!');
      navigate('/transactions');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Gagal melakukan checkout.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Checkout</h2>
      </div>

      {/* --- 2. REVISI JSX DI BAWAH INI --- */}
      <form onSubmit={handleSubmit} className="checkout-form">
        {error && <div className="error-state">{error}</div>}

        <div className="checkout-item-list">
          {rows.map((row, idx) => (
            <div key={idx} className="checkout-item-card">
              {/* Tambahkan className */}
              <select 
                className="checkout-select"
                value={row.book_id} 
                onChange={(e) => updateRow(idx, { book_id: e.target.value })}
              >
                <option value="">-- Pilih Buku --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} — (Stok: {b.stockQuantity}) — Rp {b.price.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>

              {/* Tambahkan className */}
              <input 
                className="checkout-quantity"
                type="number" 
                min={1} 
                value={row.quantity} 
                onChange={(e) => updateRow(idx, { quantity: Number(e.target.value) })}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '.' || e.key === ',') {
                    e.preventDefault();
                  }
                }}
              />

              {/* Tambahkan className */}
              <button 
                type="button" 
                className="delete-book-btn"
                onClick={() => removeRow(idx)} 
                disabled={rows.length === 1}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        {/* Tambahkan className */}
        <div className="checkout-actions">
          <button 
            type="button" 
            onClick={addRow} 
            className="manage-genre-link"
          >
            Tambah Item
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="add-book-link"
          >
            {loading ? 'Proses...' : 'Checkout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;