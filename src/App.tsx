import { Routes, Route } from 'react-router-dom';

// Import Layout
import Navbar from './components/layout/Navbar';

// Import Pages (Publik)
// import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Import Pages (Protected)
import ManageGenresPage from './pages/Genres/ManageGenresPage';
import BookListPage from './pages/Books/BookListPage';
import BookDetailPage from './pages/Books/BookDetailPage';
import AddBookPage from './pages/Books/AddBookPage';
import TransactionListPage from './pages/Transactions/TransactionListPage';
import TransactionDetailPage from './pages/Transactions/TransactionDetailPage';
import CheckoutPage from './pages/Transactions/CheckoutPage';

// Import Route Protector
import ProtectedRoute from './routes/ProtectedRoute';
import EditBookPage from './pages/Books/EditBookPage';
import ManageBooksPage from './pages/Books/ManageBooksPage';

function App() {
  return (
    <>
      {/* Navbar akan tampil di semua halaman */}
      <Navbar />
      
      {/* Konten halaman akan berganti di bawah ini */}
      <main className="container"> {/* Pastikan class .container ada di index.css */}
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<BookListPage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rute Terproteksi */}
          <Route element={<ProtectedRoute />}>
            
            {/* <Route path="/books" element={<BookListPage />} /> */}
            <Route path="/admin/books" element={<ManageBooksPage />} />
            <Route path="/books/add" element={<AddBookPage />} />
            <Route path="/books/edit/:id" element={<EditBookPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/genres" element={<ManageGenresPage />} />
            
            <Route path="/transactions" element={<TransactionListPage />} />
            <Route path="/transactions/checkout" element={<CheckoutPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          </Route>
          
          {/* Rute 404 (Not Found) */}
          <Route path="*" element={<h2>404: Halaman Tidak Ditemukan</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default App;