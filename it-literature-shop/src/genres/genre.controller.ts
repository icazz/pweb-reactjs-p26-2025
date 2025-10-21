import { Request, Response } from 'express';
import prisma from '../db';
import test = require('node:test');
import library = require('../../generated/prisma/runtime/library');
import type authMiddleware = require('../middleware/auth.middleware');

export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Genre name is required",
        });
    }

    try {
        const newGenre = await prisma.genre.create({
            data: { name },
        });
    
        res.status(201).json({
            success: true,
            message: "Genre created successfully",
            data: newGenre,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create genre",
        });
    }
};

// KOKI UNTUK MENGAMBIL SEMUA GENRE
export const getAllGenres = async (req: Request, res: Response) => {
    const {
        page = 1,
        limit = 10,
        search,
        orderByName = 'asc',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    try {
        const genres = await prisma.genre.findMany({
            where: {
                deletedAt: null,
                name: {
                    contains: search as string,
                    mode: 'insensitive',
                }
            },
            orderBy: {
                name: orderByName as 'asc' | 'desc',
            },
            skip: library.skip,
            take: Number(limit),
        });
        res.status(200).json({
            success: true,
            message: "Genres retrieved successfully",
            data: genres,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve genres",
        });
    }
};

// --- KOKI UNTUK MENGAMBIL DETAIL GENRE ---
export const getGenreById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const genre = await prisma.genre.findFirst({
      where: {
        id: id,
        deletedAt: null, // Hanya cari yang tidak di soft-delete
      },
    });

    if (!genre) {
      return res.status(404).json({
        success: false,
        message: 'Genre not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Get genre detail successfully',
      data: genre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data genre.',
    });
  }
};

// --- KOKI UNTUK MEMPERBARUI GENRE ---
export const updateGenre = async (req: authMiddleware.AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body; // Ambil data baru dari body

  try {
    const updatedGenre = await prisma.genre.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Genre updated successfully',
      data: updatedGenre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui genre.',
    });
  }
};

// --- KOKI UNTUK MENGHAPUS GENRE (SOFT DELETE) ---
export const deleteGenre = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // PENTING: Kita lakukan SOFT DELETE sesuai permintaan soal
  // Kita TIDAK menghapus datanya, hanya meng-update kolom 'deletedAt'
  try {
    await prisma.genre.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(), // Set kolom deletedAt dengan waktu sekarang
      },
    });

    res.status(200).json({
      success: true,
      message: 'Genre removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus genre.',
    });
  }
};