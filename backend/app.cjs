var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// app.js
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_config5 = require("dotenv/config");
var import_fs2 = __toESM(require("fs"), 1);

// src/app.js
var import_express5 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);

// src/config/index.js
var config_default = {
  port: Number(process.env.PORT) || 4e3,
  nodeEnv: process.env.NODE_ENV || "development",
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "iran_food"
  },
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  uploadMaxSizeMb: Number(process.env.UPLOAD_MAX_SIZE_MB) || 5,
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@iranfood.ir",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    name: process.env.ADMIN_NAME || "Admin"
  }
};

// src/routes/index.js
var import_express4 = require("express");

// src/config/db.js
var import_promise = __toESM(require("mysql2/promise"), 1);
var pool = null;
var SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS site_content (
    id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
    payload JSON NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS uploads (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL DEFAULT '',
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT UNSIGNED NOT NULL,
    path VARCHAR(512) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_upload_filename (filename),
    KEY idx_upload_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];
function getPool() {
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }
  return pool;
}
async function connectDatabase() {
  pool = import_promise.default.createPool({
    host: config_default.mysql.host,
    port: config_default.mysql.port,
    user: config_default.mysql.user,
    password: config_default.mysql.password,
    database: config_default.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: "Z"
  });
  const conn = await pool.getConnection();
  try {
    for (const sql of SCHEMA_STATEMENTS) {
      await conn.query(sql);
    }
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
  if (process.env.NODE_ENV !== "production") {
    console.log("MySQL connected");
  }
}
async function pingDatabase() {
  const p = getPool();
  await p.query("SELECT 1");
}

// src/routes/authRoutes.js
var import_express = require("express");

// src/services/authService.js
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/models/adminRow.js
function mapAdminRow(row, { includePassword = false } = {}) {
  if (!row) return null;
  const admin = {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
  if (includePassword) {
    admin.passwordHash = row.password_hash;
  }
  return admin;
}

// src/models/Admin.js
async function findAdminByEmail(email, { includePassword = false } = {}) {
  const [rows] = await getPool().query(
    "SELECT * FROM admins WHERE email = ? LIMIT 1",
    [email.toLowerCase()]
  );
  return mapAdminRow(rows[0], { includePassword });
}
async function findAdminById(id) {
  const [rows] = await getPool().query("SELECT * FROM admins WHERE id = ? LIMIT 1", [
    Number(id)
  ]);
  return mapAdminRow(rows[0]);
}
async function createAdmin({ name, email, passwordHash }) {
  try {
    const [result] = await getPool().query(
      "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email.toLowerCase(), passwordHash]
    );
    return findAdminById(result.insertId);
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      error.code = 11e3;
    }
    throw error;
  }
}

// src/utils/AppError.js
var AppError = class extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
};

// src/utils/jwt.js
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
function signToken(payload) {
  return import_jsonwebtoken.default.sign(payload, config_default.jwtSecret, {
    expiresIn: config_default.jwtExpiresIn
  });
}
function verifyToken(token) {
  return import_jsonwebtoken.default.verify(token, config_default.jwtSecret);
}

// src/services/authService.js
async function ensureDefaultAdmin() {
  const existing = await findAdminByEmail(config_default.admin.email);
  if (existing) return existing;
  try {
    const passwordHash = await import_bcryptjs.default.hash(config_default.admin.password, 12);
    return await createAdmin({
      name: config_default.admin.name,
      email: config_default.admin.email,
      passwordHash
    });
  } catch (error) {
    if (error?.code === 11e3) {
      const again = await findAdminByEmail(config_default.admin.email);
      if (again) return again;
    }
    throw error;
  }
}
async function loginAdmin(email, password) {
  const admin = await findAdminByEmail(email, { includePassword: true });
  if (!admin?.passwordHash) {
    throw new AppError("\u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A", 401);
  }
  const ok = await import_bcryptjs.default.compare(password, admin.passwordHash);
  if (!ok) {
    throw new AppError("\u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A", 401);
  }
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

// src/controllers/authController.js
async function login(req, res, next) {
  try {
    const { email, password } = req.validated;
    const result = await loginAdmin(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
async function me(req, res) {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email
    }
  });
}

// src/middleware/auth.js
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("\u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0644\u0627\u0632\u0645 \u0627\u0633\u062A", 401);
    }
    const decoded = verifyToken(token);
    const admin = await findAdminById(decoded.sub);
    if (!admin) {
      throw new AppError("\u06A9\u0627\u0631\u0628\u0631 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 401);
    }
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("\u062A\u0648\u06A9\u0646 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A", 401));
    }
    next(error);
  }
}

// src/middleware/rateLimiters.js
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var apiLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A. \u06A9\u0645\u06CC \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F."
  }
});
var authLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "\u062A\u0644\u0627\u0634\u200C\u0647\u0627\u06CC \u0648\u0631\u0648\u062F \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A. \u06A9\u0645\u06CC \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F."
  }
});
var uploadLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 60 * 1e3,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "\u062A\u0639\u062F\u0627\u062F \u0622\u067E\u0644\u0648\u062F \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A. \u06A9\u0645\u06CC \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F."
  }
});

// src/validators/index.js
var import_validator = __toESM(require("validator"), 1);

// src/utils/sanitize.js
var import_xss = __toESM(require("xss"), 1);
function sanitizeString(value = "") {
  return (0, import_xss.default)(String(value).trim());
}
function sanitizePhone(value = "") {
  return String(value).replace(/[^\d+\-\s()]/g, "").trim().slice(0, 20);
}

// src/validators/index.js
function validateUploadBody(req, res, next) {
  try {
    const name = sanitizeString(req.body?.name || "");
    const phone = sanitizePhone(req.body?.phone || "");
    if (!name || name.length < 2) {
      throw new AppError("\u0646\u0627\u0645 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F2 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F", 400);
    }
    if (name.length > 100) {
      throw new AppError("\u0646\u0627\u0645 \u0646\u0628\u0627\u06CC\u062F \u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 \u06F1\u06F0\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F", 400);
    }
    if (phone && !/^[\d+\-\s()]{7,20}$/.test(phone)) {
      throw new AppError("\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 400);
    }
    req.validated = { name, phone };
    next();
  } catch (error) {
    next(error);
  }
}
function validateLoginBody(req, res, next) {
  try {
    const email = sanitizeString(req.body?.email || "").toLowerCase();
    const password = String(req.body?.password || "");
    if (!import_validator.default.isEmail(email)) {
      throw new AppError("\u0627\u06CC\u0645\u06CC\u0644 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 400);
    }
    if (!password || password.length < 6) {
      throw new AppError("\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 400);
    }
    req.validated = { email, password };
    next();
  } catch (error) {
    next(error);
  }
}

// src/routes/authRoutes.js
var router = (0, import_express.Router)();
router.post("/login", authLimiter, validateLoginBody, login);
router.get("/me", requireAuth, me);
var authRoutes_default = router;

// src/routes/uploadRoutes.js
var import_express2 = require("express");

// src/services/uploadService.js
var import_promises = __toESM(require("fs/promises"), 1);
var import_path2 = __toESM(require("path"), 1);

// src/models/uploadRow.js
function mapUploadRow(row) {
  if (!row) return null;
  const id = String(row.id);
  return {
    id: row.id,
    _id: id,
    name: row.name,
    phone: row.phone,
    originalName: row.original_name,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.size,
    path: row.path,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// src/models/Upload.js
async function createUploadRecord(data) {
  const [result] = await getPool().query(
    `INSERT INTO uploads (name, phone, original_name, filename, mime_type, size, path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.phone || "",
      data.originalName,
      data.filename,
      data.mimeType,
      data.size,
      data.path
    ]
  );
  return findUploadById(result.insertId);
}
async function findUploadById(id) {
  const [rows] = await getPool().query("SELECT * FROM uploads WHERE id = ? LIMIT 1", [
    Number(id)
  ]);
  return mapUploadRow(rows[0]);
}
async function listUploadRecords({ skip, limit }) {
  const [rows] = await getPool().query(
    "SELECT * FROM uploads ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limit, skip]
  );
  return rows.map(mapUploadRow);
}
async function countUploads() {
  const [rows] = await getPool().query("SELECT COUNT(*) AS total FROM uploads");
  return Number(rows[0]?.total || 0);
}
async function deleteUploadById(id) {
  const [result] = await getPool().query("DELETE FROM uploads WHERE id = ?", [Number(id)]);
  return result.affectedRows > 0;
}

// src/utils/paths.js
var import_path = __toESM(require("path"), 1);
var ROOT_DIR = process.cwd();
var UPLOADS_DIR = import_path.default.join(ROOT_DIR, "uploads");

// src/services/uploadService.js
async function createUpload({ name, phone, file }) {
  const relativePath = import_path2.default.posix.join("uploads", file.filename);
  return createUploadRecord({
    name,
    phone: phone || "",
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.detectedMime || file.mimetype,
    size: file.size,
    path: relativePath
  });
}
async function listUploads({ page = 1, limit = 20 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;
  const [items, total] = await Promise.all([
    listUploadRecords({ skip, limit: safeLimit }),
    countUploads()
  ]);
  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit) || 1
    }
  };
}
async function deleteUpload(id) {
  const doc = await findUploadById(id);
  if (!doc) {
    throw new AppError("\u0631\u06A9\u0648\u0631\u062F \u06CC\u0627\u0641\u062A \u0646\u0634\u062F", 404);
  }
  const absolutePath = import_path2.default.join(UPLOADS_DIR, doc.filename);
  try {
    await import_promises.default.unlink(absolutePath);
  } catch {
  }
  await deleteUploadById(id);
  return true;
}

// src/controllers/uploadController.js
async function create(req, res, next) {
  try {
    const doc = await createUpload({
      name: req.validated.name,
      phone: req.validated.phone,
      file: req.file
    });
    res.status(201).json({
      success: true,
      message: "\u062A\u0635\u0648\u06CC\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0631\u0633\u0627\u0644 \u0634\u062F. \u0627\u0632 \u0645\u0634\u0627\u0631\u06A9\u062A \u0634\u0645\u0627 \u0633\u067E\u0627\u0633\u06AF\u0632\u0627\u0631\u06CC\u0645.",
      data: {
        id: doc._id,
        name: doc.name,
        createdAt: doc.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}
async function list(req, res, next) {
  try {
    const result = await listUploads({
      page: req.query.page,
      limit: req.query.limit
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
async function remove(req, res, next) {
  try {
    await deleteUpload(req.params.id);
    res.json({ success: true, message: "\u0631\u06A9\u0648\u0631\u062F \u0648 \u062A\u0635\u0648\u06CC\u0631 \u062D\u0630\u0641 \u0634\u062F\u0646\u062F" });
  } catch (error) {
    next(error);
  }
}

// src/middleware/upload.js
var import_fs = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_multer = __toESM(require("multer"), 1);
var ALLOWED_MIME = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
var ALLOWED_EXT = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".webp"]);
var ALLOWED_VIDEO_MIME = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/ogg"]);
var ALLOWED_VIDEO_EXT = /* @__PURE__ */ new Set([".mp4", ".webm", ".ogg"]);
function detectMime(buffer) {
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return "image/jpeg";
  }
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return "image/png";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}
var SITE_UPLOADS_DIR = import_path3.default.join(UPLOADS_DIR, "site");
if (!import_fs.default.existsSync(UPLOADS_DIR)) {
  import_fs.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!import_fs.default.existsSync(SITE_UPLOADS_DIR)) {
  import_fs.default.mkdirSync(SITE_UPLOADS_DIR, { recursive: true });
}
function resolveUploadDir(req) {
  if (req.uploadTarget === "site") {
    return SITE_UPLOADS_DIR;
  }
  return UPLOADS_DIR;
}
var storage = import_multer.default.diskStorage({
  destination: (req, _file, cb) => cb(null, resolveUploadDir(req)),
  filename: (_req, file, cb) => {
    const ext = import_path3.default.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${import_crypto.default.randomBytes(8).toString("hex")}${safeExt}`);
  }
});
function fileFilter(_req, file, cb) {
  const ext = import_path3.default.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new AppError("\u0641\u0642\u0637 \u062A\u0635\u0627\u0648\u06CC\u0631 JPG\u060C PNG \u06CC\u0627 WEBP \u0645\u062C\u0627\u0632 \u0647\u0633\u062A\u0646\u062F", 400));
  }
  cb(null, true);
}
function siteAssetFileFilter(_req, file, cb) {
  const ext = import_path3.default.extname(file.originalname).toLowerCase();
  const isImage = ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXT.has(ext);
  const isVideo = ALLOWED_VIDEO_MIME.has(file.mimetype) && ALLOWED_VIDEO_EXT.has(ext);
  if (!isImage && !isVideo) {
    return cb(new AppError("\u0641\u0642\u0637 \u062A\u0635\u0627\u0648\u06CC\u0631 JPG/PNG/WEBP \u06CC\u0627 \u0648\u06CC\u062F\u06CC\u0648 MP4/WEBM/OGG \u0645\u062C\u0627\u0632 \u0647\u0633\u062A\u0646\u062F", 400));
  }
  cb(null, true);
}
var siteAssetStorage = import_multer.default.diskStorage({
  destination: (req, _file, cb) => cb(null, resolveUploadDir(req)),
  filename: (_req, file, cb) => {
    const ext = import_path3.default.extname(file.originalname).toLowerCase();
    const allowed = /* @__PURE__ */ new Set([...ALLOWED_EXT, ...ALLOWED_VIDEO_EXT]);
    const safeExt = allowed.has(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${import_crypto.default.randomBytes(8).toString("hex")}${safeExt}`);
  }
});
var uploadSingleImage = (0, import_multer.default)({
  storage,
  fileFilter,
  limits: {
    fileSize: config_default.uploadMaxSizeMb * 1024 * 1024,
    files: 1
  }
}).single("image");
var uploadSiteAsset = (0, import_multer.default)({
  storage: siteAssetStorage,
  fileFilter: siteAssetFileFilter,
  limits: {
    fileSize: Math.max(config_default.uploadMaxSizeMb, 50) * 1024 * 1024,
    files: 1
  }
}).single("image");
async function validateSiteAsset(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("\u0627\u0646\u062A\u062E\u0627\u0628 \u0641\u0627\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A", 400);
    }
    const ext = import_path3.default.extname(req.file.filename).toLowerCase();
    if (ALLOWED_VIDEO_EXT.has(ext)) {
      return next();
    }
    const buffer = Buffer.alloc(4100);
    const fd = import_fs.default.openSync(req.file.path, "r");
    import_fs.default.readSync(fd, buffer, 0, 4100, 0);
    import_fs.default.closeSync(fd);
    const detectedMime = detectMime(buffer);
    if (!detectedMime || !ALLOWED_MIME.has(detectedMime)) {
      import_fs.default.unlinkSync(req.file.path);
      throw new AppError("\u0641\u0627\u06CC\u0644 \u0622\u067E\u0644\u0648\u062F \u0634\u062F\u0647 \u06CC\u06A9 \u062A\u0635\u0648\u06CC\u0631 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 400);
    }
    req.file.detectedMime = detectedMime;
    next();
  } catch (error) {
    next(error);
  }
}
async function validateImageMagicBytes(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("\u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0635\u0648\u06CC\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A", 400);
    }
    const buffer = Buffer.alloc(4100);
    const fd = import_fs.default.openSync(req.file.path, "r");
    import_fs.default.readSync(fd, buffer, 0, 4100, 0);
    import_fs.default.closeSync(fd);
    const detectedMime = detectMime(buffer);
    if (!detectedMime || !ALLOWED_MIME.has(detectedMime)) {
      import_fs.default.unlinkSync(req.file.path);
      throw new AppError("\u0641\u0627\u06CC\u0644 \u0622\u067E\u0644\u0648\u062F \u0634\u062F\u0647 \u06CC\u06A9 \u062A\u0635\u0648\u06CC\u0631 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A", 400);
    }
    req.file.detectedMime = detectedMime;
    next();
  } catch (error) {
    next(error);
  }
}
function handleMulterError(err, req, res, next) {
  if (!err) return next();
  if (err instanceof import_multer.default.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError(`\u062D\u062C\u0645 \u062A\u0635\u0648\u06CC\u0631 \u0646\u0628\u0627\u06CC\u062F \u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 ${config_default.uploadMaxSizeMb} \u0645\u06AF\u0627\u0628\u0627\u06CC\u062A \u0628\u0627\u0634\u062F`, 400)
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new AppError("\u0641\u0642\u0637 \u06CC\u06A9 \u062A\u0635\u0648\u06CC\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A", 400));
    }
    return next(new AppError("\u062E\u0637\u0627 \u062F\u0631 \u0622\u067E\u0644\u0648\u062F \u0641\u0627\u06CC\u0644", 400));
  }
  next(err);
}

// src/routes/uploadRoutes.js
var router2 = (0, import_express2.Router)();
router2.post(
  "/",
  uploadLimiter,
  (req, res, next) => {
    uploadSingleImage(req, res, (err) => handleMulterError(err, req, res, next));
  },
  validateImageMagicBytes,
  validateUploadBody,
  create
);
router2.get("/", requireAuth, list);
router2.delete("/:id", requireAuth, remove);
var uploadRoutes_default = router2;

// src/routes/contentRoutes.js
var import_express3 = require("express");

// src/controllers/contentController.js
var import_path4 = __toESM(require("path"), 1);

// src/data/defaultSiteContent.js
var defaultSiteContent = {
  brand: "Iran Food",
  tagline: "\u0627\u0648\u0644\u06CC\u0646 \u062F\u06CC\u062A\u0627\u0633\u062A \u062A\u0635\u0648\u06CC\u0631\u06CC \u063A\u0630\u0627\u0647\u0627\u06CC \u0627\u06CC\u0631\u0627\u0646\u06CC",
  countdownTargetDate: "",
  countdownTimerLabel: "\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u062A\u0627 \u0627\u0646\u062A\u0634\u0627\u0631",
  uploadGuideTitle: "\u062F\u0633\u062A\u0648\u0631\u0627\u0644\u0639\u0645\u0644 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC (SOP)",
  uploadModalTitle: "\u0622\u067E\u0644\u0648\u062F \u0639\u06A9\u0633 \u063A\u0630\u0627",
  uploadModalSubtitle: "\u067E\u0631\u0648\u062A\u06A9\u0644 \u062A\u0635\u0648\u06CC\u0631\u0628\u0631\u062F\u0627\u0631\u06CC \u0627\u0632 \u0646\u0645\u0648\u0646\u0647\u200C\u0647\u0627\u06CC \u063A\u0630\u0627\u06CC\u06CC",
  uploadGuideVideoUrl: "/images/project/photo-shoot.png",
  uploadGuideVideoPoster: "/images/project/photo-shoot.png",
  uploadPhotoSpecs: [
    {
      label: "\u06A9\u06CC\u0641\u06CC\u062A \u062F\u0648\u0631\u0628\u06CC\u0646",
      value: "\u0628\u0627\u0644\u0627\u062A\u0631\u06CC\u0646 \u06A9\u06CC\u0641\u06CC\u062A JPEG\u061B \u0648\u0636\u0648\u062D \u06F7\u06F2\u06F0 \u067E\u06CC\u06A9\u0633\u0644 \u06CC\u0627 DPI \u06F3\u06F0\u06F0 \u2014 \u06A9\u0627\u0641\u06CC \u0628\u0631\u0627\u06CC \u062F\u06CC\u062F\u0647 \u0634\u062F\u0646 \u062F\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0628\u0631\u0646\u062C \u0648 \u062C\u0632\u0626\u06CC\u0627\u062A \u063A\u0630\u0627"
    },
    {
      label: "\u0632\u0627\u0648\u06CC\u0647 \u062A\u0635\u0648\u06CC\u0631\u0628\u0631\u062F\u0627\u0631\u06CC",
      value: "\u0627\u0632 \u06F3 \u0632\u0627\u0648\u06CC\u0647 \u0627\u062C\u0628\u0627\u0631\u06CC: \u0628\u0627\u0644\u0627 (\u0639\u0645\u0648\u062F\u06CC)\u060C \u0631\u0648\u0628\u0631\u0648\u060C \u0648 \u0645\u0648\u0631\u0628 \u06F4\u06F5 \u062F\u0631\u062C\u0647 \u2014 \u0641\u0642\u0637 \u06CC\u06A9 \u0632\u0627\u0648\u06CC\u0647 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A"
    },
    {
      label: "\u0646\u0648\u0631 \u0648 \u0641\u0644\u0627\u0634",
      value: "\u0627\u0632 \u0641\u0644\u0627\u0634 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u06A9\u0646\u06CC\u062F\u061B \u0646\u0648\u0631 \u06CC\u06A9\u0646\u0648\u0627\u062E\u062A (\u062A\u0631\u062C\u06CC\u062D\u0627\u064B \u0637\u0628\u06CC\u0639\u06CC \u06A9\u0646\u0627\u0631 \u067E\u0646\u062C\u0631\u0647) \u2014 \u0641\u0644\u0627\u0634 \u062E\u0627\u0645\u0648\u0634"
    },
    {
      label: "\u0631\u0646\u06AF\u200C\u0647\u0627 (\u0648\u0627\u06CC\u062A\u200C\u0628\u0627\u0644\u0627\u0646\u0633)",
      value: "\u062D\u0627\u0644\u062A \u062E\u0648\u062F\u06A9\u0627\u0631 \u062E\u0627\u0645\u0648\u0634\u061B \u062A\u0646\u0638\u06CC\u0645 \u062F\u0633\u062A\u06CC \u0645\u062A\u0646\u0627\u0633\u0628 \u0628\u0627 \u0646\u0648\u0631 \u0645\u062D\u06CC\u0637"
    },
    {
      label: "\u067E\u0633\u200C\u0632\u0645\u06CC\u0646\u0647",
      value: "\u0633\u0627\u062F\u0647 \u0648 \u063A\u06CC\u0631\u0628\u0631\u0627\u0642\u061B \u0645\u0646\u0648\u060C \u0644\u06CC\u0648\u0627\u0646 \u0648 \u0627\u0634\u06CC\u0627\u0621 \u0627\u0636\u0627\u0641\u06CC \u0631\u0627 \u0627\u0632 \u06A9\u0627\u062F\u0631 \u062E\u0627\u0631\u062C \u06A9\u0646\u06CC\u062F"
    },
    {
      label: "\u06A9\u0627\u0631\u062A \u0645\u0631\u062C\u0639",
      value: "\u06CC\u06A9 \u0642\u0627\u0634\u0642 \u06CC\u0627 \u0686\u0646\u06AF\u0627\u0644 \u063A\u0630\u0627\u062E\u0648\u0631\u06CC \u06A9\u0646\u0627\u0631 \u0628\u0634\u0642\u0627\u0628 \u062F\u0631 \u0644\u0628\u0647 \u0642\u0627\u0628 \u0642\u0631\u0627\u0631 \u062F\u0647\u06CC\u062F"
    },
    {
      label: "\u0641\u0627\u0635\u0644\u0647 \u062A\u0627 \u0628\u0634\u0642\u0627\u0628",
      value: "\u06F3\u06F0 \u062A\u0627 \u06F4\u06F0 \u0633\u0627\u0646\u062A\u06CC\u200C\u0645\u062A\u0631 (\u06CC\u06A9 \u062A\u0627 \u062F\u0648 \u0648\u062C\u0628)\u060C \u062B\u0627\u0628\u062A \u0628\u0631\u0627\u06CC \u0647\u0645\u0647 \u0632\u0627\u0648\u06CC\u0647\u200C\u0647\u0627"
    },
    {
      label: "\u063A\u0630\u0627\u0647\u0627\u06CC \u062A\u0631\u06A9\u06CC\u0628\u06CC",
      value: "\u062F\u0631 \u0635\u0648\u0631\u062A \u0627\u0645\u06A9\u0627\u0646 \u0642\u0628\u0644 \u0627\u0632 \u0645\u062E\u0644\u0648\u0637 \u06A9\u0631\u062F\u0646 \u062C\u062F\u0627\u06AF\u0627\u0646\u0647 \u0639\u06A9\u0633 \u0628\u06AF\u06CC\u0631\u06CC\u062F\u061B \u062F\u0631 \u063A\u06CC\u0631 \u0627\u06CC\u0646 \u0635\u0648\u0631\u062A \u0628\u0631\u0686\u0633\u0628 \xAB\u0645\u062E\u0644\u0648\u0637 \u0634\u062F\u0647\xBB \u0631\u0648\u06CC \u0639\u06A9\u0633 \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F"
    },
    {
      label: "\u0641\u06CC\u0644\u0645 \u0686\u0631\u062E\u0634\u06CC \u06F3\u06F6\u06F0\xB0",
      value: "\u06F1\u06F5 \u062B\u0627\u0646\u06CC\u0647\u060C \u062D\u0631\u06A9\u062A \u0622\u0631\u0627\u0645 \u0648 \u062B\u0627\u0628\u062A \u062F\u0648\u0631 \u0628\u0634\u0642\u0627\u0628 \u2014 \u0628\u062F\u0648\u0646 \u0644\u0631\u0632\u0634 \u0648 \u0639\u062C\u0644\u0647"
    },
    {
      label: "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0646\u0627\u0645 \u063A\u0630\u0627",
      value: "\u0646\u0627\u0645 \u0631\u0627\u06CC\u062C \u0648 \u06A9\u0627\u0645\u0644 \u063A\u0630\u0627 \u0631\u0627 \u0628\u0644\u0627\u0641\u0627\u0635\u0644\u0647 \u062F\u0631 \u06AF\u0648\u0634\u06CC \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u06A9\u0646\u06CC\u062F"
    },
    {
      label: "\u0628\u0631\u0631\u0633\u06CC \u0646\u0647\u0627\u06CC\u06CC",
      value: "\u0648\u0636\u0648\u062D\u060C \u0631\u0646\u06AF\u200C\u0647\u0627\u060C \u0639\u062F\u0645 \u0648\u062C\u0648\u062F \u0633\u0627\u06CC\u0647 \u0648 \u062A\u0627\u0631 \u0628\u0648\u062F\u0646 \u0631\u0627 \u0642\u0628\u0644 \u0627\u0632 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u062A\u0631\u0644 \u06A9\u0646\u06CC\u062F"
    },
    {
      label: "\u062B\u0627\u0628\u062A \u0646\u06AF\u0647 \u062F\u0627\u0634\u062A\u0646 \u06AF\u0648\u0634\u06CC",
      value: "\u062F\u0648\u0631\u0628\u06CC\u0646 \u0631\u0627 \u0631\u0648\u06CC \u0645\u06CC\u0632 \u062A\u06A9\u06CC\u0647 \u062F\u0647\u06CC\u062F \u06CC\u0627 \u0628\u0627 \u062F\u0648 \u062F\u0633\u062A \u0628\u06AF\u06CC\u0631\u06CC\u062F"
    }
  ],
  collaborationsTitle: "\u0647\u0645\u06A9\u0627\u0631\u06CC\u200C\u0647\u0627",
  collaborations: [],
  nav: [
    { label: "\u062E\u0627\u0646\u0647", href: "#home" },
    { label: "\u062F\u0631\u0628\u0627\u0631\u0647 \u0645\u0627", href: "#about" },
    { label: "\u06A9\u0627\u0631\u0628\u0631\u062F\u0647\u0627", href: "#why" }
  ],
  contact: { email: "info@iranfood.ir", phone: "", address: "" }
};

// src/services/contentService.js
function deepMerge(base, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return patch ?? base;
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
      out[key] = deepMerge(base[key], value);
    } else if (value !== void 0) {
      out[key] = value;
    }
  }
  return out;
}
async function getStoredPayload() {
  const pool2 = getPool();
  const [rows] = await pool2.query("SELECT payload FROM site_content WHERE id = 1 LIMIT 1");
  if (!rows.length) return null;
  let stored = rows[0].payload;
  if (typeof stored === "string") stored = JSON.parse(stored);
  return stored;
}
function normalizeNav(payload) {
  if (!Array.isArray(payload.nav)) return payload;
  payload.nav = payload.nav.map((item) => {
    let href = item.href;
    if (item.label === "\u062F\u0631\u0628\u0627\u0631\u0647 \u0645\u0627" || href === "#countdown") href = "#about";
    if (item.label === "\u06A9\u0627\u0631\u0628\u0631\u062F\u0647\u0627" || href === "#apps" || href === "#why") href = "#apps";
    return { ...item, href };
  });
  return payload;
}
function sanitizeCountdownDate(raw) {
  if (!raw || !String(raw).trim()) return "";
  const text = String(raw).trim();
  const parsed = Date.parse(text);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  const faMatch = text.match(/(\d+)\s*روز[\s\S]*?(\d+)\s*ساعت/);
  if (faMatch) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() + Number(faMatch[1]));
    date.setHours(date.getHours() + Number(faMatch[2]), 0, 0, 0);
    return date.toISOString();
  }
  return "";
}
function sanitizePayload(payload) {
  const out = { ...payload };
  const iso = sanitizeCountdownDate(out.countdownTargetDate) || sanitizeCountdownDate(out.countdownTarget);
  if (iso) {
    out.countdownTargetDate = iso;
    out.countdownTarget = iso;
  }
  return normalizeNav(out);
}
async function getSiteContent() {
  const stored = await getStoredPayload();
  if (!stored) {
    return { ...defaultSiteContent };
  }
  return sanitizePayload(deepMerge(defaultSiteContent, stored));
}
async function saveSiteContent(payload) {
  const stored = await getStoredPayload() || {};
  const merged = sanitizePayload(deepMerge(deepMerge(defaultSiteContent, stored), payload));
  const pool2 = getPool();
  await pool2.query(
    `INSERT INTO site_content (id, payload) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP`,
    [JSON.stringify(merged)]
  );
  return merged;
}

// src/controllers/contentController.js
async function getContent(_req, res, next) {
  try {
    const data = await getSiteContent();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
async function updateContent(req, res, next) {
  try {
    const payload = req.body?.content ?? req.body;
    if (!payload || typeof payload !== "object") {
      throw new AppError("\u062F\u0627\u062F\u0647 \u0645\u062D\u062A\u0648\u0627 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A", 400);
    }
    const data = await saveSiteContent(payload);
    res.json({ success: true, message: "\u0645\u062D\u062A\u0648\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F", data });
  } catch (error) {
    next(error);
  }
}
async function uploadAsset(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("\u0641\u0627\u06CC\u0644 \u062A\u0635\u0648\u06CC\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A", 400);
    }
    const publicPath = `/uploads/site/${import_path4.default.basename(req.file.filename)}`;
    res.json({
      success: true,
      message: "\u0641\u0627\u06CC\u0644 \u0622\u067E\u0644\u0648\u062F \u0634\u062F",
      data: { path: publicPath, url: publicPath }
    });
  } catch (error) {
    next(error);
  }
}

// src/routes/contentRoutes.js
var router3 = (0, import_express3.Router)();
router3.get("/", getContent);
router3.put("/", requireAuth, updateContent);
router3.post(
  "/assets",
  requireAuth,
  (req, _res, next) => {
    req.uploadTarget = "site";
    next();
  },
  (req, res, next) => {
    uploadSiteAsset(req, res, (err) => handleMulterError(err, req, res, next));
  },
  validateSiteAsset,
  uploadAsset
);
var contentRoutes_default = router3;

// src/routes/index.js
var router4 = (0, import_express4.Router)();
router4.get("/health", async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ success: true, message: "OK", db: "mysql" });
  } catch {
    res.status(503).json({ success: false, message: "Database unavailable", db: "mysql" });
  }
});
router4.use("/auth", authRoutes_default);
router4.use("/uploads", uploadRoutes_default);
router4.use("/content", contentRoutes_default);
var routes_default = router4;

// src/middleware/errorHandler.js
function notFoundHandler(req, res, next) {
  next(new AppError("\u0645\u0633\u06CC\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F", 404));
}
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational || statusCode < 500 ? err.message : "\u062E\u0637\u0627\u06CC \u062F\u0627\u062E\u0644\u06CC \u0633\u0631\u0648\u0631";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || void 0
  });
}

// src/app.js
function createApp() {
  const app2 = (0, import_express5.default)();
  app2.set("trust proxy", 1);
  app2.use(
    (0, import_helmet.default)({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  const allowedOrigins = new Set(
    String(process.env.CORS_ORIGIN || config_default.corsOrigin).split(",").map((o) => o.trim()).filter(Boolean)
  );
  allowedOrigins.add("https://iranfoodd.ir");
  allowedOrigins.add("https://www.iranfoodd.ir");
  app2.use(
    (0, import_cors.default)({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app2.use(import_express5.default.json({ limit: "100kb" }));
  app2.use(import_express5.default.urlencoded({ extended: false, limit: "100kb" }));
  app2.use("/api", apiLimiter);
  app2.use(
    "/uploads",
    import_express5.default.static(UPLOADS_DIR, {
      fallthrough: true,
      maxAge: "7d",
      setHeaders(res) {
        res.setHeader("X-Content-Type-Options", "nosniff");
      }
    })
  );
  app2.use("/api", routes_default);
  app2.use(notFoundHandler);
  app2.use(errorHandler);
  return app2;
}

// app.js
if (!import_fs2.default.existsSync(UPLOADS_DIR)) {
  import_fs2.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var dbReady = false;
var ready = connectDatabase().then(() => ensureDefaultAdmin()).then(() => {
  dbReady = true;
}).catch((err) => {
  console.error("Database bootstrap failed:", err);
});
var app = createApp();
app.use(async (req, res, next) => {
  await ready;
  if (!dbReady) {
    return res.status(503).json({
      success: false,
      message: "\u0633\u0631\u0648\u06CC\u0633 API \u0645\u0648\u0642\u062A\u0627\u064B \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A. \u062A\u0646\u0638\u06CC\u0645\u0627\u062A MySQL \u0631\u0627 \u062F\u0631 .env \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F."
    });
  }
  next();
});
var app_default = app;

module.exports = app;
