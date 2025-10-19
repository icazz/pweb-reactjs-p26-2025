import { PrismaClient } from '@prisma/client';

// Buat satu instance (objek) PrismaClient
// Kita akan 'import' variabel 'prisma' ini di semua file controller nanti
const prisma = new PrismaClient({
  // Opsi ini bagus untuk development, untuk melihat query SQL di terminal
  log: ['query', 'info', 'warn', 'error'],
});

// Ekspor instance tersebut agar bisa dipakai di file lain
export default prisma;