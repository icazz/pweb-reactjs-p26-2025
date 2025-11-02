// src/books/book.routes.ts

const express = require('express');
const router = express.Router();

// Gunakan DESTRUCTURING untuk mendapatkan fungsi controller secara langsung
const { 
    createBookController, 
    updateBookController, 
    deleteBookController,
    getAllBooksController,
    getBookDetailController
} = require('./book.controller'); 

// Impor middleware (juga harus diekspor sebagai CommonJS)
const { authenticateToken } = require('../middleware/auth.middleware'); 

// Rute yang membutuhkan autentikasi/otorisasi
router.post('/', authenticateToken, createBookController); 
router.patch('/:book_id', authenticateToken, updateBookController); 
router.delete('/:book_id', authenticateToken, deleteBookController);

// Rute publik (Read)
router.get('/', getAllBooksController); 
router.get('/genre/:genre_id', getAllBooksController); 
router.get('/:book_id', getBookDetailController);

module.exports = router;