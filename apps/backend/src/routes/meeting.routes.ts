import { Router } from 'express';
import * as meetingController from '../controllers/meeting.controller';
import { authenticate } from '../middlewares/authenticate';

const router: Router = Router();

router.get('/', authenticate, meetingController.getMeetings);
router.get('/:id', authenticate, meetingController.getMeetingById);
router.post('/', authenticate, meetingController.createMeeting);
router.put('/:id', authenticate, meetingController.updateMeeting);
router.delete('/:id', authenticate, meetingController.deleteMeeting);
router.post('/:id/feedback', authenticate, meetingController.addFeedback);

export default router;
