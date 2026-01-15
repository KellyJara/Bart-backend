import {Router} from 'express';

const router = Router();
import * as userCtrl from '../controllers/user.controller.js';
import {verifyToken, isAdmin} from '../middlewares/authJwt.js';
import {checkRolesExisted,checkDuplicateUsernameOrEmail} from '../middlewares/verifySignup.js';

router.post('/createuser', 
    [verifyToken, isAdmin, checkDuplicateUsernameOrEmail, checkRolesExisted],
    userCtrl.createUser);

export default router;