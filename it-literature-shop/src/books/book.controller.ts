// src/books/book.controller.ts

const { Request, Response } = require('express');
const { Prisma } = require('@prisma/client');
const { prisma } = require('../db'); // Asumsi db.ts export { prisma }

// Tipe kustom (Hanya untuk referensi, karena CommonJS lebih longgar)
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

// 1. POST /books (Create Book)
exports.createBookController = async (req: AuthRequest, res: Response) => {
    const { title, writer, publisher, publication_year, description, price, stock_quantity, genre_id } = req.body;

    try {
        // A. CEK DUPLIKASI JUDUL (Wajib)
        const existingBook = await prisma.books.findUnique({
            where: { title: title },
        });
        if (existingBook) {
            return res.status(409).json({ message: 'Duplikasi judul buku. Judul sudah ada di database.' });
        }

        // B. BUAT BUKU
        const newBook = await prisma.books.create({
            data: {
                title, writer, publisher, publication_year, description, 
                price: parseFloat(price), // Pastikan harga di-parse sebagai float
                stock_quantity: parseInt(stock_quantity),
                genre_id,
            },
            include: { genre: true },
        });

        res.status(201).json({ message: 'Buku berhasil dibuat.', data: newBook });

    } catch (error: any) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: 'Gagal membuat buku.', error: error.message });
    }
};

// 2. GET /books & /books/genre/:genre_id (Filter dan Pagination)
exports.getAllBooksController = async (req: Request, res: Response) => {
    try {
        const { page, limit, title, writer } = req.query;
        const { genre_id } = req.params; 

        const pageNum = page ? parseInt(page as string) : 1;
        const limitNum = limit ? parseInt(limit as string) : 10;
        const skip = (pageNum - 1) * limitNum;

        const whereClause: any = { 
            deleted_at: null, // Hanya yang tidak di-soft delete
        };

        if (genre_id) {
            whereClause.genre_id = genre_id;
        }

        if (title) {
            whereClause.title = { contains: title as string, mode: 'insensitive' };
        }
        if (writer) {
            whereClause.writer = { contains: writer as string, mode: 'insensitive' };
        }

        // JALANKAN QUERY DENGAN PAGINATION & FILTER
        const [booksData, totalCount] = await prisma.$transaction([
            prisma.books.findMany({
                where: whereClause,
                skip: skip,
                take: limitNum,
                orderBy: { created_at: 'desc' },
                include: { genre: true },
            }),
            prisma.books.count({ where: whereClause }),
        ]);
        
        res.status(200).json({ 
            message: 'Daftar buku berhasil diambil.', 
            data: booksData,
            meta: { total: totalCount, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalCount / limitNum) }
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mengambil daftar buku.', error: error.message });
    }
};

// 3. GET /books/:book_id (Get Book Detail)
exports.getBookDetailController = async (req: Request, res: Response) => {
    try {
        const { book_id } = req.params;
        const book = await prisma.books.findFirst({
            where: { id: book_id, deleted_at: null },
            include: { genre: true },
        });
        
        if (!book) {
            return res.status(404).json({ message: 'Buku tidak ditemukan.' });
        }
        
        res.status(200).json({ message: 'Detail buku berhasil diambil.', data: book });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mengambil detail buku.', error: error.message });
    }
};

// 4. PATCH /books/:book_id (Update Book)
exports.updateBookController = async (req: AuthRequest, res: Response) => {
    try {
        const { book_id } = req.params;
        const data = req.body;
        
        // A. CEK DUPLIKASI JUDUL JIKA ADA PERUBAHAN JUDUL
        if (data.title) {
            const existingBook = await prisma.books.findFirst({
                where: { title: data.title, id: { not: book_id } },
            });
            if (existingBook) {
                return res.status(409).json({ message: 'Duplikasi judul buku. Judul sudah ada di database.' });
            }
        }

        // B. JALANKAN QUERY UPDATE (termasuk update stok)
        const updatedBook = await prisma.books.update({
            where: { id: book_id },
            data: data,
            include: { genre: true },
        });
        
        res.status(200).json({ message: 'Buku berhasil diperbarui.', data: updatedBook });

    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Gagal memperbarui: Buku tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal memperbarui buku.', error: error.message });
    }
};

// 5. DELETE /books/:book_id (Soft Delete)
exports.deleteBookController = async (req: AuthRequest, res: Response) => {
    try {
        const { book_id } = req.params;
        
        await prisma.books.update({
            where: { id: book_id },
            data: { deleted_at: new Date() },
        });
        
        res.status(200).json({ message: 'Buku berhasil dihapus (soft delete).' });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Gagal menghapus: Buku tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal menghapus buku.', error: error.message });
    }
};