import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Request body expected for POST /transactions:
 * {
 *   items: [
 *     { bookId: string, quantity: number },
 *     ...
 *   ]
 * }
 *
 * Jika model/schema kamu memiliki nama field berbeda (misal Book.price bukan price),
 * ubah akses field di bagian yang diberi komentar "ADJUST IF NEEDED".
 */

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'items harus array dan tidak kosong' });
    }

    // Ambil semua buku yang terlibat supaya bisa validasi stok & harga
    const bookIds = items.map((it: any) => it.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
    });

    // index book by id
    const bookMap = new Map<string, any>();
    books.forEach(b => bookMap.set(b.id, b));

    // Validasi
    for (const it of items) {
      const b = bookMap.get(it.bookId);
      if (!b) return res.status(404).json({ success: false, message: `Book ${it.bookId} not found` });
      if (typeof it.quantity !== 'number' || it.quantity <= 0) {
        return res.status(400).json({ success: false, message: `quantity tidak valid untuk book ${it.bookId}` });
      }
      // ADJUST IF NEEDED: field stock pada model Book mungkin bernama 'stock' atau 'qty' -> ubah jika berbeda
      if (typeof b.stock === 'number' && b.stock < it.quantity) {
        return res.status(400).json({ success: false, message: `Stok tidak cukup untuk ${b.title || b.id}` });
      }
    }

    // Hitung total (ADJUST IF NEEDED: jika field harga bukan 'price', ganti di sini)
    let totalNominal = 0;
    for (const it of items) {
      const b = bookMap.get(it.bookId);
      const price = typeof b.price === 'number' ? b.price : 0; // fallback 0 jika tidak ada
      totalNominal += price * it.quantity;
    }

    // Buat Order + OrderItems (menggunakan nested create)
    // ADJUST IF NEEDED: pastikan nama relasi 'orderItems' sesuai dengan schema prisma Order model
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,           // pastikan field userId sesuai di schema (umumnya 'userId')
        total: totalNominal,       // jika model Order tidak punya 'total', kita tetap menyimpan; jika tidak ada, hapus properti ini
        orderItems: {
          create: items.map((it: any) => ({
            quantity: it.quantity,
            book: { connect: { id: it.bookId } },
          })),
        },
      },
      include: {
        orderItems: {
          include: { book: { include: { genre: true } } },
        },
        user: true,
      },
    });

    // Kurangi stok buku (jika ada kolom stock)
    for (const it of items) {
      const b = bookMap.get(it.bookId);
      if (typeof b.stock === 'number') {
        await prisma.book.update({
          where: { id: it.bookId },
          data: { stock: { decrement: it.quantity } }, // Prisma numeric operation
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction created',
      data: newOrder,
    });
  } catch (error: any) {
    console.error('createTransaction error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1'));
    const limit = Math.max(1, parseInt((req.query.limit as string) || '10'));
    const skip = (page - 1) * limit;

    // Ambil order dengan include orderItems -> book -> genre
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          orderItems: { include: { book: { include: { genre: true } } } },
          user: true,
        },
        orderBy: { createdAt: 'desc' as const },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    return res.json({
      success: true,
      data: orders,
      meta: { total, page, limit },
    });
  } catch (error: any) {
    console.error('getAllTransactions error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { book: { include: { genre: true } } } },
        user: true,
      },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Transaction not found' });
    return res.json({ success: true, data: order });
  } catch (error: any) {
    console.error('getTransactionById error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};

export const getTransactionStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { book: { include: { genre: true } } } },
      },
    });

    const totalTransactions = orders.length;
    let totalNominal = 0;

    const genreCountMap = new Map<string, { name: string; count: number }>();

    for (const o of orders) {
      // jika model Order punya field total, gunakan itu; kalau tidak, hitung dari items
      if (typeof (o as any).total === 'number') {
        totalNominal += (o as any).total;
      } else {
        // hitung dari items
        for (const it of (o as any).orderItems || []) {
          const price = (it.book && typeof it.book.price === 'number') ? it.book.price : 0;
          totalNominal += price * (it.quantity || 0);
        }
      }

      for (const it of (o as any).orderItems || []) {
        const genre = it.book?.genre;
        const gId = genre?.id || 'unknown';
        const gName = genre?.name || 'Unknown';
        const cur = genreCountMap.get(gId) || { name: gName, count: 0 };
        cur.count += 1;
        genreCountMap.set(gId, cur);
      }
    }

    const avg = totalTransactions > 0 ? totalNominal / totalTransactions : 0;

    // cari genre max / min (berdasarkan jumlah transaksi)
    const genreArray = Array.from(genreCountMap.entries()).map(([id, val]) => ({ id, ...val }));
    genreArray.sort((a, b) => b.count - a.count);

    const most = genreArray[0] || null;
    const least = genreArray[genreArray.length - 1] || null;

    return res.json({
      success: true,
      data: {
        totalTransactions,
        averageNominalPerTransaction: avg,
        genreWithMostTransactions: most,
        genreWithLeastTransactions: least,
      },
    });
  } catch (error: any) {
    console.error('getTransactionStatistics error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: String(error) });
  }
};