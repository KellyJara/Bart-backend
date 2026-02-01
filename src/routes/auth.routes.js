import {Router} from 'express';
import * as authController from '../controllers/auth.controller.js';
import {checkDuplicateUsernameOrEmail, checkRolesExisted} from '../middlewares/verifySignup.js';

const router = Router();

router.post('/signup',
    [checkDuplicateUsernameOrEmail, checkRolesExisted],
     authController.signUp);
router.post('/signin', authController.signIn);

export default router;