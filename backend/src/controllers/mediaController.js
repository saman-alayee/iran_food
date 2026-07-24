import { saveCmsMedia, deleteCmsMedia } from '../services/mediaService.js';

export async function uploadMedia(req, res, next) {
  try {
    const media = await saveCmsMedia(req.file);
    res.status(201).json({
      success: true,
      message: 'تصویر با موفقیت بارگذاری شد',
      data: media,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMedia(req, res, next) {
  try {
    await deleteCmsMedia(req.params.filename);
    res.json({
      success: true,
      message: 'تصویر حذف شد',
    });
  } catch (error) {
    next(error);
  }
}
