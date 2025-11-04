export interface TransactionItemDetail {
  book_id: string;
  book_title: string;
  quantity: number;
  subtotal_price: number;
}

// Tipe untuk list transaksi (GET /transactions)
export interface Transaction {
  id: string;
  total_quantity: number;
  total_price: number;
}

// Tipe untuk detail transaksi (GET /transactions/:id)
export interface TransactionDetail extends Transaction {
  items: TransactionItemDetail[];
}

// Tipe untuk item keranjang saat checkout (POST /transactions)
export interface CheckoutItem {
  book_id: string;
  quantity: number;
}