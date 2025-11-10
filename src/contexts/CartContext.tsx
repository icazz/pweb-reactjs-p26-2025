// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/book.types';

// Tipe untuk item di keranjang: Buku + kuantitas
export interface CartItem extends Book {
  quantity: number;
}

// Tipe untuk nilai yang akan dibagikan oleh Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

// Buat Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Buat "Penyedia" (Provider)
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fungsi untuk menambah item ke keranjang
  const addToCart = (book: Book, quantity: number) => {
    setCartItems(prevItems => {
      // Cek apakah buku sudah ada di keranjang
      const existingItem = prevItems.find(item => item.id === book.id);

      if (existingItem) {
        // Jika sudah ada, perbarui kuantitasnya
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Jika belum ada, tambahkan sebagai item baru
        return [...prevItems, { ...book, quantity }];
      }
    });
  };

  // Fungsi untuk menghapus item
  const removeFromCart = (bookId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  // Fungsi untuk mengubah kuantitas
  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      // Jika kuantitas 0 or negatif, hapus item
      removeFromCart(bookId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Fungsi untuk mengosongkan keranjang (setelah checkout)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider 
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook kustom untuk memakai context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};