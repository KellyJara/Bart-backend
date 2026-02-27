import {Router} from 'express';

const router = Router();
import * as userCtrl from '../controllers/user.controller.js';
import {verifyToken, isAdmin} from '../middlewares/authJwt.js';
import {checkRolesExisted,checkDuplicateUsernameOrEmail} from '../middlewares/verifySignup.js';

router.post('/createuser', 
    [verifyToken, isAdmin, checkDuplicateUsernameOrEmail, checkRolesExisted],
    userCtrl.createUser);

router.get('/profile', 
    [verifyToken],
    userCtrl.getUserProfile);

router.get('/:id', userCtrl.getUserById);

router.get('/users', userCtrl.getAllUsers);

router.put('/:userId', 
    [verifyToken],
    userCtrl.updateUser)

export default router;