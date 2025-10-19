// src/auth/auth.routes.ts

import { Router } from 'express';

// 1. Buat instance router baru
const router = Router();

// (Nanti kita akan tambahkan router.post('/register', ...) di sini)

// 2. WAJIB: Ekspor router ini agar 'index.ts' bisa mengimpornya
export default router;