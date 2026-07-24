import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/AppError.js';

const CMS_UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'cms');

export async function ensureCmsDir() {
  await fs.mkdir(CMS_UPLOADS_DIR, { recursive: true });
}

export async function saveCmsMedia(file) {
  await ensureCmsDir();
  const relativePath = path.posix.join('uploads', 'cms', file.filename);
  return {
    path: relativePath,
    filename: file.filename,
    mimeType: file.detectedMime || file.mimetype,
    size: file.size,
    originalName: file.originalname,
  };
}

export async function deleteCmsMedia(filename) {
  const safeName = path.basename(filename);
  if (!safeName || safeName !== filename) {
    throw new AppError('نام فایل نامعتبر است', 400);
  }
  const absolutePath = path.join(CMS_UPLOADS_DIR, safeName);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  return true;
}
