import fs from 'fs/promises';
import path from 'path';
import {
  createUploadRecord,
  deleteUploadById,
  findUploadById,
  listUploadRecords,
  countUploads,
} from '../models/Upload.js';
import { AppError } from '../utils/AppError.js';
import { UPLOADS_DIR } from '../utils/paths.js';

export async function createUpload({ name, phone, file }) {
  const relativePath = path.posix.join('uploads', file.filename);

  return createUploadRecord({
    name,
    phone: phone || '',
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.detectedMime || file.mimetype,
    size: file.size,
    path: relativePath,
  });
}

export async function listUploads({ page = 1, limit = 12 } = {}) {
  const safePage = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 12));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    listUploadRecords({ skip, limit: safeLimit }),
    countUploads(),
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
  const doc = await findUploadById(id);
  if (!doc) {
    throw new AppError('رکورد یافت نشد', 404);
  }

  const absolutePath = path.join(UPLOADS_DIR, doc.filename);
  try {
    await fs.unlink(absolutePath);
  } catch {
    // file may already be missing
  }

  await deleteUploadById(id);
  return true;
}
