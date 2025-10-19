import express, { Request, Response } from 'express';

// 1. Impor "Waiter" (Router)
// Kita hanya impor 'authRoutes' dulu sesuai rencana
import authRoutes from './auth/auth.routes';

// (Nanti Anda akan tambahkan impor lain di sini)
// import genreRoutes from './genres/genre.routes';
// import bookRoutes from './books/book.routes';
// import transactionRoutes from './transactions/transaction.routes';

const app = express();
const PORT = 8080; // Sesuai Postman {{BASE_URL}}

// 2. Middleware (Alat Bantu)
// Ini WAJIB ada agar server bisa membaca body JSON dari Postman
app.use(express.json());

// 3. Endpoint Wajib Sesuai Soal
// Ini untuk mengecek apakah server Anda hidup
app.get('/health-check', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running!",
    data: { date: new Date() },
  });
});

// 4. Pembagian Tugas "Waiter" (Router)
// "Setiap pesanan yang awalnya '/auth', teruskan ke authRoutes"
app.use('/auth', authRoutes);

// (Nanti Anda akan tambahkan pendaftaran router lain di sini)
// app.use('/genre', genreRoutes);
// app.use('/books', bookRoutes);
// app.use('/transactions', transactionRoutes);

// 5. Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});