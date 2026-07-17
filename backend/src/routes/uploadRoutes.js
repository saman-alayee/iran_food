import { Router } from 'express';
import { create, list, remove } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  handleMulterError,
  uploadSingleImage,
  validateImageMagicBytes,
} from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { validateUploadBody } from '../validators/index.js';

const router = Router();

router.post(
  '/',
  uploadLimiter,
  (req, res, next) => {
    uploadSingleImage(req, res, (err) => handleMulterError(err, req, res, next));
  },
  validateImageMagicBytes,
  validateUploadBody,
  create
);

router.get('/', requireAuth, list);
router.delete('/:id', requireAuth, remove);

export default router;
