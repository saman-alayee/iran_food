import { Router } from 'express';
import authRoutes from './authRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contentRoutes from './contentRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);
router.use('/content', contentRoutes);
router.use('/media', mediaRoutes);

export default router;
