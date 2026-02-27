import {Router} from 'express';

const router = Router();
import * as cartCtrl from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

router.post('/', 
    [verifyToken], 
    cartCtrl.addToCart);

router.get('/', 
    [verifyToken], 
    cartCtrl.getCart); 

router.delete('/:productId', 
    [verifyToken], 
    cartCtrl.removeFromCart);

export default router;