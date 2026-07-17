import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';
import config from '../config/index.js';

export async function ensureDefaultAdmin() {
  const existing = await Admin.findOne({ email: config.admin.email });
  if (existing) return existing;

  try {
    const passwordHash = await bcrypt.hash(config.admin.password, 12);
    return await Admin.create({
      name: config.admin.name,
      email: config.admin.email,
      passwordHash,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const again = await Admin.findOne({ email: config.admin.email });
      if (again) return again;
    }
    throw error;
  }
}

export async function loginAdmin(email, password) {
  const admin = await Admin.findOne({ email }).select('+passwordHash');
  if (!admin) {
    throw new AppError('ایمیل یا رمز عبور اشتباه است', 401);
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    throw new AppError('ایمیل یا رمز عبور اشتباه است', 401);
  }

  const token = signToken({ sub: admin._id.toString(), role: 'admin' });

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  };
}
