import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre
} from './genre.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', createGenre);
router.get('/', getAllGenres);
router.get('/:id', getGenreById);
router.patch('/:id', updateGenre);
router.delete('/:id', deleteGenre);

export default router;