import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, res, next) {
  next(new AppError('مسیر یافت نشد', 404));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : 'خطای داخلی سرور';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || undefined,
  });
}
