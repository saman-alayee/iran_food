import bcrypt from 'bcryptjs';
import {
  createAdmin,
  findAdminByEmail,
  findAdminById,
  updateAdminPassword,
} from '../models/Admin.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';
import config from '../config/index.js';

export async function ensureDefaultAdmin() {
  const existing = await findAdminByEmail(config.admin.email);
  if (existing) return existing;

  try {
    const passwordHash = await bcrypt.hash(config.admin.password, 12);
    return await createAdmin({
      name: config.admin.name,
      email: config.admin.email,
      passwordHash,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const again = await findAdminByEmail(config.admin.email);
      if (again) return again;
    }
    throw error;
  }
}

export async function loginAdmin(email, password) {
  const admin = await findAdminByEmail(email, { includePassword: true });
  if (!admin?.passwordHash) {
    throw new AppError('ایمیل یا رمز عبور اشتباه است', 401);
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    throw new AppError('ایمیل یا رمز عبور اشتباه است', 401);
  }

  const token = signToken({ sub: String(admin.id), role: 'admin' });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  };
}

export async function changeAdminPassword(adminId, currentPassword, newPassword) {
  const admin = await findAdminById(adminId, { includePassword: true });
  if (!admin?.passwordHash) {
    throw new AppError('کاربر معتبر نیست', 401);
  }

  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) {
    throw new AppError('رمز عبور فعلی اشتباه است', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('رمز جدید باید حداقل ۸ کاراکتر باشد', 400);
  }

  if (currentPassword === newPassword) {
    throw new AppError('رمز جدید باید با رمز فعلی متفاوت باشد', 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateAdminPassword(admin.id, passwordHash);

  const token = signToken({ sub: String(admin.id), role: 'admin' });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  };
}
