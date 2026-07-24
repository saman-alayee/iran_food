import { Router } from 'express';
import { getContent, saveContent } from '../controllers/contentController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/', getContent);
router.put('/', requireAuth, authLimiter, saveContent);

export default router;
