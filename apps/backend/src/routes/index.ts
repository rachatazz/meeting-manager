import { Router } from 'express';
import authRoutes from './auth.routes';
import meetingRoutes from './meeting.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/meetings', meetingRoutes);

export default router;
