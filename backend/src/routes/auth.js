import { Router } from 'express';
import {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser
} from '../controllers/authController.js';

const router = Router();

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

export default router;
