import { Router } from 'express';
import { changePassword, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { validateChangePasswordBody, validateLoginBody } from '../validators/index.js';

const router = Router();

router.post('/login', authLimiter, validateLoginBody, login);
router.get('/me', requireAuth, me);
router.post('/change-password', requireAuth, authLimiter, validateChangePasswordBody, changePassword);

export default router;
