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