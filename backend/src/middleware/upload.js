import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { UPLOADS_DIR } from '../utils/paths.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_VIDEO_MIME = new Set(['video/mp4', 'video/webm', 'video/ogg']);
const ALLOWED_VIDEO_EXT = new Set(['.mp4', '.webm', '.ogg']);

function detectMime(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

const SITE_UPLOADS_DIR = path.join(UPLOADS_DIR, 'site');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(SITE_UPLOADS_DIR)) {
  fs.mkdirSync(SITE_UPLOADS_DIR, { recursive: true });
}

function resolveUploadDir(req) {
  if (req.uploadTarget === 'site') {
    return SITE_UPLOADS_DIR;
  }
  return UPLOADS_DIR;
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => cb(null, resolveUploadDir(req)),
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

function siteAssetFileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXT.has(ext);
  const isVideo = ALLOWED_VIDEO_MIME.has(file.mimetype) && ALLOWED_VIDEO_EXT.has(ext);
  if (!isImage && !isVideo) {
    return cb(new AppError('فقط تصاویر JPG/PNG/WEBP یا ویدیو MP4/WEBM/OGG مجاز هستند', 400));
  }
  cb(null, true);
}

const siteAssetStorage = multer.diskStorage({
  destination: (req, _file, cb) => cb(null, resolveUploadDir(req)),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = new Set([...ALLOWED_EXT, ...ALLOWED_VIDEO_EXT]);
    const safeExt = allowed.has(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`);
  },
});

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploadMaxSizeMb * 1024 * 1024,
    files: 1,
  },
}).single('image');

export const uploadSiteAsset = multer({
  storage: siteAssetStorage,
  fileFilter: siteAssetFileFilter,
  limits: {
    fileSize: Math.max(config.uploadMaxSizeMb, 50) * 1024 * 1024,
    files: 1,
  },
}).single('image');

export async function validateSiteAsset(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('انتخاب فایل الزامی است', 400);
    }

    const ext = path.extname(req.file.filename).toLowerCase();
    if (ALLOWED_VIDEO_EXT.has(ext)) {
      return next();
    }

    const buffer = Buffer.alloc(4100);
    const fd = fs.openSync(req.file.path, 'r');
    fs.readSync(fd, buffer, 0, 4100, 0);
    fs.closeSync(fd);

    const detectedMime = detectMime(buffer);
    if (!detectedMime || !ALLOWED_MIME.has(detectedMime)) {
      fs.unlinkSync(req.file.path);
      throw new AppError('فایل آپلود شده یک تصویر معتبر نیست', 400);
    }

    req.file.detectedMime = detectedMime;
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateImageMagicBytes(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('انتخاب تصویر الزامی است', 400);
    }

    const buffer = Buffer.alloc(4100);
    const fd = fs.openSync(req.file.path, 'r');
    fs.readSync(fd, buffer, 0, 4100, 0);
    fs.closeSync(fd);

    const detectedMime = detectMime(buffer);
    if (!detectedMime || !ALLOWED_MIME.has(detectedMime)) {
      fs.unlinkSync(req.file.path);
      throw new AppError('فایل آپلود شده یک تصویر معتبر نیست', 400);
    }

    req.file.detectedMime = detectedMime;
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
