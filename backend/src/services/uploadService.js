import fs from 'fs/promises';
import path from 'path';
import { Upload } from '../models/Upload.js';
import { AppError } from '../utils/AppError.js';
import { UPLOADS_DIR } from '../utils/paths.js';

export async function createUpload({ name, phone, file }) {
  const relativePath = path.posix.join('uploads', file.filename);

  const doc = await Upload.create({
    name,
    phone: phone || '',
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.detectedMime || file.mimetype,
    size: file.size,
    path: relativePath,
  });

  return doc;
}

export async function listUploads({ page = 1, limit = 20 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Upload.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    Upload.countDocuments(),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit) || 1,
    },
  };
}

export async function deleteUpload(id) {
  const doc = await Upload.findById(id);
  if (!doc) {
    throw new AppError('رکورد یافت نشد', 404);
  }

  const absolutePath = path.join(UPLOADS_DIR, doc.filename);
  try {
    await fs.unlink(absolutePath);
  } catch {
    // file may already be missing
  }

  await doc.deleteOne();
  return true;
}
