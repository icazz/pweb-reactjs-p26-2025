// src/pages/Transactions/CartPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { createTransactionService } from '../../services/transactionService';
import type { CheckoutItem } from '../../types/transaction.types';
import './Transactions.css'; // Kita pinjam style
import '../Books/Books.css'; // Pinjam style tombol

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hitung total harga
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    // 1. Ubah CartItems menjadi format yang diminta API
    const itemsToCheckout: CheckoutItem[] = cartItems.map(item => ({
      book_id: item.id,
      quantity: item.quantity
    }));

    // 2. Validasi (jika perlu)
    if (itemsToCheckout.length === 0) {
      setError('Keranjang Anda kosong.');
      setLoading(false);
      return;
    }

    try {
      // 3. Panggil API
      await createTransactionService(itemsToCheckout);
      
      // 4. Kosongkan keranjang & arahkan
      setLoading(false);
      alert('Transaksi berhasil!');
      clearCart();
      navigate('/transactions'); // Arahkan ke riwayat transaksi

    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Gagal membuat transaksi.');
    }
  };

  return (
    <div className="transaction-container">
      <h2>Keranjang Belanja</h2>
      {error && <div className="error-state">{error}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-state">Keranjang Anda kosong.</div>
      ) : (
        <>
          {/* Gunakan style dari .transaction-items-list */}
          <div className="transaction-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="transaction-detail-item">
                
                {/* Gambar Thumbnail */}
                {item.book_image ? (
                  <img src={`http://localhost:8080${item.book_image}`} alt={item.title} className="list-item-image" />
                ) : (
                  <div className="list-item-image-placeholder"><span>No Img</span></div>
                )}
                
                {/* Info & Kuantitas */}
                <div className="detail-item-info">
                  <p className="item-title">{item.title}</p>
                  <p className="item-quantity">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                  </div>

                  <div className="cart-item-quantity">
                  <input
                    type="number"
                    className="checkout-quantity"
                    value={item.quantity}
                    min="1"
                    max={item.stockQuantity} // Batasi dengan stok
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    onKeyDown={(e) => { // Blok desimal/minus
                      if (e.key === '-' || e.key === '.' || e.key === ',') {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                
                
                {/* Subtotal & Tombol Hapus */}
                <div className="detail-item-subtotal">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </div>

                {/* 5. Tombol Hapus */}
                <div className="cart-item-remove">
                  <button 
                    className="delete-book-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Tombol Checkout */}
          <div className="checkout-summary">
            <h3>Total Belanja: Rp {totalPrice.toLocaleString('id-ID')}</h3>
            <button 
              className="add-book-link" // Pinjam style tombol biru
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Checkout Sekarang'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;