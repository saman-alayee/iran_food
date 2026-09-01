import path from 'path';
import { getSiteContent, saveSiteContent } from '../services/contentService.js';
import { AppError } from '../utils/AppError.js';

export async function getContent(_req, res, next) {
  try {
    const data = await getSiteContent();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateContent(req, res, next) {
  try {
    const payload = req.body?.content ?? req.body;
    if (!payload || typeof payload !== 'object') {
      throw new AppError('داده محتوا نامعتبر است', 400);
    }
    const data = await saveSiteContent(payload);
    res.json({ success: true, message: 'محتوا ذخیره شد', data });
  } catch (error) {
    next(error);
  }
}

export async function uploadAsset(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('فایل تصویر الزامی است', 400);
    }
    const publicPath = `/uploads/site/${path.basename(req.file.filename)}`;
    res.json({
      success: true,
      message: 'فایل آپلود شد',
      data: { path: publicPath, url: publicPath },
    });
  } catch (error) {
    next(error);
  }
}