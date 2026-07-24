#!/usr/bin/env python3
"""Patch production app.cjs bundle with change-password support and upload."""
from __future__ import annotations

import ftplib
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()
MARKER = "CHANGE_PASSWORD_ROUTE_PATCHED"


def patch(text: str) -> str:
    if MARKER in text:
        return text

    text = text.replace(
        """async function findAdminById(id) {
  const [rows] = await getPool().query("SELECT * FROM admins WHERE id = ? LIMIT 1", [
    Number(id)
  ]);
  return mapAdminRow(rows[0]);
}""",
        """async function findAdminById(id, { includePassword = false } = {}) {
  const [rows] = await getPool().query("SELECT * FROM admins WHERE id = ? LIMIT 1", [
    Number(id)
  ]);
  return mapAdminRow(rows[0], { includePassword });
}
async function updateAdminPassword(id, passwordHash) {
  await getPool().query("UPDATE admins SET password_hash = ? WHERE id = ?", [
    passwordHash,
    Number(id)
  ]);
}""",
    )

    text = text.replace(
        """  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  };
}

// src/controllers/authController.js""",
        """  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  };
}
async function changeAdminPassword(adminId, currentPassword, newPassword) {
  const admin = await findAdminById(adminId, { includePassword: true });
  if (!admin?.passwordHash) {
    throw new AppError("\\u06A9\\u0627\\u0631\\u0628\\u0631 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 401);
  }
  const ok = await import_bcryptjs.default.compare(currentPassword, admin.passwordHash);
  if (!ok) {
    throw new AppError("\\u0631\\u0645\\u0632 \\u0639\\u0628\\u0648\\u0631 \\u0641\\u0639\\u0644\\u06CC \\u0627\\u0634\\u062A\\u0628\\u0627\\u0647 \\u0627\\u0633\\u062A", 400);
  }
  if (newPassword.length < 8) {
    throw new AppError("\\u0631\\u0645\\u0632 \\u062C\\u062F\\u06CC\\u062F \\u0628\\u0627\\u06CC\\u062F \\u062D\\u062F\\u0627\\u0642\\u0644 \\u06F8 \\u06A9\\u0627\\u0631\\u0627\\u06A9\\u062A\\u0631 \\u0628\\u0627\\u0634\\u062F", 400);
  }
  if (currentPassword === newPassword) {
    throw new AppError("\\u0631\\u0645\\u0632 \\u062C\\u062F\\u06CC\\u062F \\u0628\\u0627\\u06CC\\u062F \\u0628\\u0627 \\u0631\\u0645\\u0632 \\u0641\\u0639\\u0644\\u06CC \\u0645\\u062A\\u0641\\u0627\\u0648\\u062A \\u0628\\u0627\\u0634\\u062F", 400);
  }
  const passwordHash = await import_bcryptjs.default.hash(newPassword, 12);
  await updateAdminPassword(admin.id, passwordHash);
  const token = signToken({ sub: String(admin.id), role: "admin" });
  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  };
}

// src/controllers/authController.js""",
    )

    text = text.replace(
        """async function me(req, res) {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email
    }
  });
}

// src/middleware/auth.js""",
        """async function me(req, res) {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email
    }
  });
}
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.validated;
    const result = await changeAdminPassword(String(req.admin.id || req.admin._id), currentPassword, newPassword);
    res.json({
      success: true,
      message: "\\u0631\\u0645\\u0632 \\u0639\\u0628\\u0648\\u0631 \\u0628\\u0627 \\u0645\\u0648\\u0641\\u0642\\u06CC\\u062A \\u062A\\u063A\\u06CC\\u06CC\\u0631 \\u06A9\\u0631\\u062F",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

// src/middleware/auth.js""",
    )

    text = text.replace(
        """function validateLoginBody(req, res, next) {
  try {
    const email = sanitizeString(req.body?.email || "").toLowerCase();
    const password = String(req.body?.password || "");
    if (!import_validator.default.isEmail(email)) {
      throw new AppError("\\u0627\\u06CC\\u0645\\u06CC\\u0644 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    if (!password || password.length < 6) {
      throw new AppError("\\u0631\\u0645\\u0632 \\u0639\\u0628\\u0648\\u0631 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    req.validated = { email, password };
    next();
  } catch (error) {
    next(error);
  }
}

// src/routes/authRoutes.js""",
        """function validateLoginBody(req, res, next) {
  try {
    const email = sanitizeString(req.body?.email || "").toLowerCase();
    const password = String(req.body?.password || "");
    if (!import_validator.default.isEmail(email)) {
      throw new AppError("\\u0627\\u06CC\\u0645\\u06CC\\u0644 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    if (!password || password.length < 6) {
      throw new AppError("\\u0631\\u0645\\u0632 \\u0639\\u0628\\u0648\\u0631 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    req.validated = { email, password };
    next();
  } catch (error) {
    next(error);
  }
}
function validateChangePasswordBody(req, res, next) {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");
    const confirmPassword = String(req.body?.confirmPassword || "");
    if (!currentPassword || currentPassword.length < 6) {
      throw new AppError("\\u0631\\u0645\\u0632 \\u0639\\u0628\\u0648\\u0631 \\u0641\\u0639\\u0644\\u06CC \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    if (!newPassword || newPassword.length < 8) {
      throw new AppError("\\u0631\\u0645\\u0632 \\u062C\\u062F\\u06CC\\u062F \\u0628\\u0627\\u06CC\\u062F \\u062D\\u062F\\u0627\\u0642\\u0644 \\u06F8 \\u06A9\\u0627\\u0631\\u0627\\u06A9\\u062A\\u0631 \\u0628\\u0627\\u0634\\u062F", 400);
    }
    if (newPassword !== confirmPassword) {
      throw new AppError("\\u062A\\u06A9\\u0631\\u0627\\u0631 \\u0631\\u0645\\u0632 \\u062C\\u062F\\u06CC\\u062F \\u0628\\u0627 \\u0631\\u0645\\u0632 \\u062C\\u062F\\u06CC\\u062F \\u06CC\\u06A9\\u0633\\u0627\\u0646 \\u0646\\u06CC\\u0633\\u062A", 400);
    }
    req.validated = { currentPassword, newPassword };
    next();
  } catch (error) {
    next(error);
  }
}

// src/routes/authRoutes.js""",
    )

    text = text.replace(
        'router.get("/me", requireAuth, me);\nvar authRoutes_default = router;',
        'router.get("/me", requireAuth, me);\nrouter.post("/change-password", requireAuth, authLimiter, validateChangePasswordBody, changePassword);\n// '
        + MARKER
        + "\nvar authRoutes_default = router;",
    )

    if MARKER not in text:
        raise SystemExit("Failed to patch app.cjs — anchors not found")

    return text


def main() -> None:
    ftp = ftplib.FTP("89.39.208.237", timeout=120)
    ftp.login("zjdekntt", PASSWORD)
    buf = io.BytesIO()
    ftp.retrbinary("RETR iran_food/backend/app.cjs", buf.write)
    original = buf.getvalue().decode("utf-8")
    patched = patch(original)
    if patched == original:
        print("already patched")
    else:
        bio = io.BytesIO(patched.encode("utf-8"))
        ftp.storbinary("STOR iran_food/backend/app.cjs", bio)
        print("uploaded patched app.cjs")
    try:
        ftp.cwd("iran_food/backend/tmp")
    except ftplib.error_perm:
        ftp.mkd("iran_food/backend/tmp")
        ftp.cwd("iran_food/backend/tmp")
    ftp.storbinary("STOR restart.txt", io.BytesIO(b"restart"))
    print("restart touched")
    ftp.quit()


if __name__ == "__main__":
    main()
