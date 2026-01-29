import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { submitQuestion, getUserQuestions } from '../controllers/questionController.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('user'));

router.post('/', submitQuestion);
router.get('/', getUserQuestions);

export default router;
