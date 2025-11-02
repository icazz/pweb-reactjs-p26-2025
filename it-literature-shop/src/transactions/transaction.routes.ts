import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionStatistics
} from './transaction.controller';

const router = Router();

// Semua route transaksi butuh autentikasi
router.use(authMiddleware);

router.post('/', createTransaction);
router.get('/statistics', getTransactionStatistics);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);

export default router;