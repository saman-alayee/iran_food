import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { UPLOADS_DIR } from '../utils/paths.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new AppError('فقط تصاویر JPG، PNG یا WEBP مجاز هستند', 400));
  }
  cb(null, true);
}

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploadMaxSizeMb * 1024 * 1024,
    files: 1,
  },
}).single('image');

export async function validateImageMagicBytes(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('انتخاب تصویر الزامی است', 400);
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

export function handleMulterError(err, req, res, next) {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(`حجم تصویر نباید بیشتر از ${config.uploadMaxSizeMb} مگابایت باشد`, 400)
      );
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('فقط یک تصویر مجاز است', 400));
    }
    return next(new AppError('خطا در آپلود فایل', 400));
  }

  next(err);
}
