import { Router } from 'express';
import { pingDatabase } from '../config/db.js';
import authRoutes from './authRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contentRoutes from './contentRoutes.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ success: true, message: 'OK', db: 'mysql' });
  } catch {
    res.status(503).json({ success: false, message: 'Database unavailable', db: 'mysql' });
  }
});

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/content', contentRoutes);

export default router;
