import validator from 'validator';
import { AppError } from '../utils/AppError.js';
import { sanitizePhone, sanitizeString } from '../utils/sanitize.js';

export function validateUploadBody(req, res, next) {
  try {
    const name = sanitizeString(req.body?.name || '');
    const phone = sanitizePhone(req.body?.phone || '');

    if (!name || name.length < 2) {
      throw new AppError('نام باید حداقل ۲ کاراکتر باشد', 400);
    }
    if (name.length > 100) {
      throw new AppError('نام نباید بیشتر از ۱۰۰ کاراکتر باشد', 400);
    }
    if (phone && !/^[\d+\-\s()]{7,20}$/.test(phone)) {
      throw new AppError('شماره تماس معتبر نیست', 400);
    }

    req.validated = { name, phone };
    next();
  } catch (error) {
    next(error);
  }
}

export function validateLoginBody(req, res, next) {
  try {
    const email = sanitizeString(req.body?.email || '').toLowerCase();
    const password = String(req.body?.password || '');

    if (!validator.isEmail(email)) {
      throw new AppError('ایمیل معتبر نیست', 400);
    }
    if (!password || password.length < 6) {
      throw new AppError('رمز عبور معتبر نیست', 400);
    }

    req.validated = { email, password };
    next();
  } catch (error) {
    next(error);
  }
}

export function validateChangePasswordBody(req, res, next) {
  try {
    const currentPassword = String(req.body?.currentPassword || '');
    const newPassword = String(req.body?.newPassword || '');
    const confirmPassword = String(req.body?.confirmPassword || '');

    if (!currentPassword || currentPassword.length < 6) {
      throw new AppError('رمز عبور فعلی معتبر نیست', 400);
    }
    if (!newPassword || newPassword.length < 8) {
      throw new AppError('رمز جدید باید حداقل ۸ کاراکتر باشد', 400);
    }
    if (newPassword !== confirmPassword) {
      throw new AppError('تکرار رمز جدید با رمز جدید یکسان نیست', 400);
    }

    req.validated = { currentPassword, newPassword };
    next();
  } catch (error) {
    next(error);
  }
}
