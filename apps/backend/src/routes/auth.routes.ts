import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';

const router: Router = Router();

router.get('/me', authenticate, authController.getMe);
router.post('/register', authController.register);
router.post('/register/guest', authController.registerGuest);
router.post('/login', authController.login);
router.post('/login/guest', authController.loginGuest);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
