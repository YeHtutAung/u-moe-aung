import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getAllQuestions, getAllUsers, replyToQuestion } from '../controllers/adminController.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/questions', getAllQuestions);
router.get('/users', getAllUsers);
router.post('/questions/:id/reply', replyToQuestion);

export default router;
