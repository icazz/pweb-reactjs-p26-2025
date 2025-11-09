import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooksService } from '../../services/bookService';
import { createTransactionService } from '../../services/transactionService';
import type { Book } from '../../types/book.types';
import './Transactions.css';

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
    // load a reasonable number of books for selection
    const fetchBooks = async () => {
      try {
        const resp = await getAllBooksService({ page: 1, limit: 100 });
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

    // client-side validation
    const items = rows
      .filter(r => r.book_id)
      .map(r => ({ book_id: r.book_id, quantity: Number(r.quantity) }));

    if (items.length === 0) {
      setError('Pilih minimal 1 buku untuk checkout.');
      return;
    }

    setLoading(true);
    try {
      await createTransactionService(items);
      // redirect to list
      navigate('/transactions');
    } catch (err: any) {
      setError(err?.message || 'Gagal melakukan checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Checkout</h2>
      </div>

      <form onSubmit={handleSubmit} className="transaction-detail-container">
        {error && <div className="error-state">{error}</div>}

        <div className="item-list">
          {rows.map((row, idx) => (
            <div key={idx} className="item-card" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={row.book_id} onChange={(e) => updateRow(idx, { book_id: e.target.value })}>
                <option value="">-- Pilih Buku --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} — Rp {b.price.toLocaleString()}</option>
                ))}
              </select>

              <input type="number" min={1} value={row.quantity} onChange={(e) => updateRow(idx, { quantity: Number(e.target.value) })} style={{ width: 100 }} />

              <button type="button" onClick={() => removeRow(idx)} disabled={rows.length === 1}>Hapus</button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={addRow} style={{ marginRight: 8 }}>Tambah Item</button>
          <button type="submit" disabled={loading}>{loading ? 'Proses...' : 'Checkout'}</button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
