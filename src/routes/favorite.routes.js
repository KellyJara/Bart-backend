import { Router } from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.get('/', verifyToken, getFavorites);
// POST /api/favorites → toggle like/unlike
router.post('/', verifyToken, toggleFavorite);

export default router;