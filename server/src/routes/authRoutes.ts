import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  verifyEmail,
  resendVerificationEmail,
  setPassword
} from '../controllers/authController';

import { protect } from '../middleware/auth';
import { validateSignup, validateLogin } from '../utils/validators';

const router = express.Router();

router.post('/signup', validateSignup, register);
router.post('/login', validateLogin, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/set-password', protect, setPassword);
router.get('/me', protect, getMe);

export default router;
