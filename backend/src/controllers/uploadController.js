import {
  createUpload,
  deleteUpload,
  listUploads,
} from '../services/uploadService.js';

export async function create(req, res, next) {
  try {
    const doc = await createUpload({
      name: req.validated.name,
      phone: req.validated.phone,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: 'تصویر با موفقیت ارسال شد. از مشارکت شما سپاسگزاریم.',
      data: {
        id: doc._id,
        name: doc.name,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const result = await listUploads({
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteUpload(req.params.id);
    res.json({ success: true, message: 'رکورد و تصویر حذف شدند' });
  } catch (error) {
    next(error);
  }
}
