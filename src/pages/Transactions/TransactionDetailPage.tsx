// src/pages/Transactions/TransactionDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionByIdService } from '../../services/transactionService';
import type { TransactionDetail } from '../../types/transaction.types';
import './Transactions.css';

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setError('ID transaksi tidak ditemukan pada URL.');
      setLoading(false);
      return;
    }

    const fetchTransactionDetail = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactionByIdService(id);
        if (isMounted && data) {
          setTransaction(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Gagal mengambil detail transaksi.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactionDetail();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading detail transaksi...</p>;
    if (error) return <p className="error-state">Error: {error}</p>;
  if (!transaction) return <p>Tidak ada data transaksi.</p>;

  return (
      <div className="transaction-container">
        <div className="transaction-detail-header">
          <h2>Detail Transaksi</h2>
        <p><strong>ID Transaksi:</strong> {transaction.id}</p>
              <h3 className="total-price">Total Belanja: Rp {(transaction.total_price || 0).toLocaleString()}</h3>
              <p><strong>Total Item:</strong> {transaction.total_quantity || 0}</p>
        </div>

        <div className="transaction-items-list">
          <h3>Item yang Dibeli:</h3>
          <div className="item-list">
        {transaction.items && transaction.items.length > 0 ? (
          transaction.items.map((item) => (
              <div key={item.book_id} className="transaction-detail-item">
                  <div className="detail-item-info">
                      <p className="item-title">{item.book_title}</p>
                      <p className="item-quantity">Jumlah: {item.quantity}</p>
                  </div>
                  <div className="detail-item-subtotal">
                      Rp {(item.subtotal_price || 0).toLocaleString()}
                  </div>
                </div>
          ))
        ) : (
            <p className="empty-state">Item tidak tersedia.</p>
        )}
          </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
