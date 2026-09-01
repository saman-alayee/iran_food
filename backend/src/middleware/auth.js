import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';
import { findAdminById } from '../models/Admin.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('احراز هویت لازم است', 401);
    }

    const decoded = verifyToken(token);
    const admin = await findAdminById(decoded.sub);

    if (!admin) {
      throw new AppError('کاربر معتبر نیست', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('توکن نامعتبر یا منقضی شده است', 401));
    }
    next(error);
  }
}
