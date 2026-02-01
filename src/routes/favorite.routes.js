import { Router } from 'express';
import { toggleFavorite } from '../controllers/favorite.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

// POST /api/favorites → toggle like/unlike
router.post('/', verifyToken, toggleFavorite);

export default router;