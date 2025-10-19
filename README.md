<div align="center">

# Praktikum Pemrograman Website Modul 3 2025

</div>

## Kelompok P26

| Nama                        | NRP        |
| --------------------------- | ---------- |
| Zaenal Mustofa              | 5027241018 |
| Abiyyu Raihan Putra Wikanto | 5027241042 |
| Ica Zika Hamizah            | 5027241058 |

## Pengaturan Proyek dan Database

### Inisialisasi Proyek

```bash
mkdir it-literature-shop
cd it-literature-shop
npm init -y
npm install typescript @types/node ts-node --save-dev
npx tsc --init
```

### Install Dependencies   

```bash
npm install express pg jsonwebtoken bcryptjs
npm install @types/express @types/jsonwebtoken @types/bcryptjs --save-dev
npm install prisma --save-dev
```

### Setup Database Neon

### Inisialisasi Prisma

```bash
npx prisma init --datasource-provider postgresql
```

- Buka file .env yang baru dibuat dan tempel URL koneksi dari Neon ke variabel DATABASE_URL.
- Buka prisma/schema.prisma dan pastikan provider pada datasource db adalah postgresql.

## Desain Skema dan Migrasi Database

### Definisikan Model

Buka prisma/schema.prisma dan definisikan model untuk User, Book, Genre, dan Transaction

### Migrasi Database

```bash 
npx prisma migrate dev --name init
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Implementasi Endpoint API

Buat struktur folder seperti ini:
```bash
src/
├── auth/
├── books/
├── genres/
├── transactions/
├── middleware/
│   └── auth.middleware.ts
└── index.ts
```

### Buat Middleware Autentikasi

- Buat file `src/middleware/auth.middleware.ts`.

- Fungsi ini akan mengambil token dari header `Authorization: Bearer <token>`, memverifikasinya menggunakan `jsonwebtoken`, dan menempelkan data user ke objek `request`. Ini akan digunakan untuk melindungi semua endpoint yang membutuhkan login.

### Implementasikan Modul Auth (/auth)

- `POST /register`: Ambil `email` dan `password` dari body. Gunakan `bcrypt` untuk hash password sebelum menyimpannya ke database.

- `POST /login`: Cari user berdasarkan `email`. Bandingkan password yang diinput dengan hash di database menggunakan `bcrypt.compare()`. Jika cocok, buat `access_token` menggunakan `jsonwebtoken`.

- `GET /me`: Terapkan middleware autentikasi di rute ini. Ambil data user dari `request` dan kirimkan kembali.

### Implementasikan Modul Books & Genres

- CRUD Biasa: Untuk `POST`, `GET`, `PATCH`, gunakan fungsi dasar Prisma Client (`create`, `findMany`, `findUnique`, `update`).

- `GET` dengan Filter: Untuk endpoint `GET /books` dan `GET /genre`, gunakan `req.query` untuk mengambil parameter seperti `page`, `limit`, `search`. Terapkan ini ke dalam query Prisma menggunakan `skip`, `take`, dan `where`.

- Soft Delete: Untuk `DELETE /books/:id`, jangan gunakan `prisma.book.delete()`. Sebaliknya, gunakan prisma.book.update() untuk mengisi kolom `deletedAt` dengan tanggal saat ini.

```bash
// Contoh implementasi Soft Delete
const deletedBook = await prisma.book.update({
  where: { id: bookId },
  data: { deletedAt: new Date() },
});
```

### Implementasikan Modul Transactions

- `POST /transactions`: Ini adalah logika yang paling kompleks. Anda harus menggunakan `prisma.$transaction` untuk memastikan semua query berhasil atau gagal bersamaan (atomik).

Looping melalui array `items` dari `req.body`.
Untuk setiap item, kurangi `stock_quantity` di tabel `Book`.
Buat entri di tabel `Transaction` dan `TransactionItem`.


- `GET /transactions/statistics`: Endpoint ini memerlukan query agregasi dari Prisma untuk menghitung total, rata-rata, dan menemukan genre dengan penjualan terbanyak/sedikit.

Note: pastikan setiap respons yang kita kirim kembali ke klien sesuai dengan format { success, message, data } yang diminta oleh dokumentasi.