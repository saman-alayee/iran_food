import { loginAdmin } from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated;
    const result = await loginAdmin(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
    },
  });
}
