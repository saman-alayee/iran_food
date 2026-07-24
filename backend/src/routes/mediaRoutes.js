import { Router } from 'express';
import { uploadMedia, removeMedia } from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import {
  uploadCmsImage,
  validateCmsImageMagicBytes,
} from '../middleware/cmsUpload.js';
import { handleMulterError } from '../middleware/upload.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  authLimiter,
  uploadCmsImage,
  handleMulterError,
  validateCmsImageMagicBytes,
  uploadMedia
);
router.delete('/:filename', requireAuth, authLimiter, removeMedia);

export default router;
