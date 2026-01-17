import {Router} from 'express';

const router = Router();

import {getProducts,getProductById,createProduct,updateProduct,deleteProduct} from '../controllers/product.controller.js';
import {verifyToken, isAdmin,isModerator} from '../middlewares/authJwt.js';

router.get('/',getProducts);
router.get('/:productId', getProductById);
router.post('/',[verifyToken], createProduct);
router.put('/:productId',[verifyToken], updateProduct);
router.delete('/:productId', [verifyToken], deleteProduct);


export default router;
