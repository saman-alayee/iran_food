import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { CMS_UPLOADS_DIR } from '../utils/paths.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);

if (!fs.existsSync(CMS_UPLOADS_DIR)) {
  fs.mkdirSync(CMS_UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, CMS_UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
    cb(null, `cms-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new AppError('فقط تصاویر JPG، PNG، WEBP یا SVG مجاز هستند', 400));
  }
  cb(null, true);
}

export const uploadCmsImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploadMaxSizeMb * 1024 * 1024,
    files: 1,
  },
}).single('image');

export async function validateCmsImageMagicBytes(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('انتخاب تصویر الزامی است', 400);
    }

    if (req.file.mimetype === 'image/svg+xml') {
      req.file.detectedMime = 'image/svg+xml';
      return next();
    }

    const buffer = Buffer.alloc(4100);
    const fd = fs.openSync(req.file.path, 'r');
    fs.readSync(fd, buffer, 0, 4100, 0);
    fs.closeSync(fd);

    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ALLOWED_MIME.has(detected.mime)) {
      fs.unlinkSync(req.file.path);
      throw new AppError('فایل آپلود شده یک تصویر معتبر نیست', 400);
    }

    req.file.detectedMime = detected.mime;
    next();
  } catch (error) {
    next(error);
  }
}
