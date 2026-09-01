import { Router } from 'express';
import { getContent, updateContent, uploadAsset } from '../controllers/contentController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  handleMulterError,
  uploadSiteAsset,
  validateSiteAsset,
} from '../middleware/upload.js';

const router = Router();

router.get('/', getContent);
router.put('/', requireAuth, updateContent);
router.post(
  '/assets',
  requireAuth,
  (req, _res, next) => {
    req.uploadTarget = 'site';
    next();
  },
  (req, res, next) => {
    uploadSiteAsset(req, res, (err) => handleMulterError(err, req, res, next));
  },
  validateSiteAsset,
  uploadAsset
);

export default router;