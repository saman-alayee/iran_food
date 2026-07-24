#!/usr/bin/env python3
"""Patch production app.cjs with CMS content/media API and upload."""
from __future__ import annotations

import ftplib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()
MARKER = "CMS_ROUTES_PATCHED"
DEFAULT_JSON = json.loads((ROOT / "cms_default_content.json").read_text(encoding="utf-8-sig"))


def cms_block() -> str:
    default_literal = json.dumps(DEFAULT_JSON, ensure_ascii=False)
    return f"""
// {MARKER}
var CMS_DEFAULT_CONTENT = {default_literal};
function cmsDeepMerge(base, patch) {{
  if (patch === null || patch === void 0) return base;
  if (Array.isArray(patch)) return patch;
  if (typeof patch !== "object" || Array.isArray(base)) return patch;
  const out = {{ ...base }};
  for (const [key, value] of Object.entries(patch)) {{
    out[key] = cmsDeepMerge(base?.[key], value);
  }}
  return out;
}}
async function ensureContentTable() {{
  await getPool().query(`CREATE TABLE IF NOT EXISTS site_content (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content_key VARCHAR(50) NOT NULL,
    content_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_content_key (content_key)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}}
async function getSiteContent() {{
  await ensureContentTable();
  const [rows] = await getPool().query(
    "SELECT content_json FROM site_content WHERE content_key = ? LIMIT 1",
    ["main"]
  );
  if (!rows[0]) {{
    await getPool().query(
      "INSERT INTO site_content (content_key, content_json) VALUES (?, ?)",
      ["main", JSON.stringify(CMS_DEFAULT_CONTENT)]
    );
    return CMS_DEFAULT_CONTENT;
  }}
  return cmsDeepMerge(CMS_DEFAULT_CONTENT, JSON.parse(rows[0].content_json));
}}
async function updateSiteContent(payload) {{
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {{
    throw new AppError("\\u062F\\u0627\\u062F\\u0647 \\u0645\\u062D\\u062A\\u0648\\u0627 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
  }}
  await ensureContentTable();
  const merged = cmsDeepMerge(CMS_DEFAULT_CONTENT, payload);
  await getPool().query(
    `INSERT INTO site_content (content_key, content_json)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
    ["main", JSON.stringify(merged)]
  );
  return merged;
}}
var CMS_UPLOADS_DIR = import_path.default.join(UPLOADS_DIR, "cms");
if (!import_fs.default.existsSync(CMS_UPLOADS_DIR)) {{
  import_fs.default.mkdirSync(CMS_UPLOADS_DIR, {{ recursive: true }});
}}
var CMS_ALLOWED_MIME = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
var CMS_ALLOWED_EXT = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);
var cmsStorage = import_multer.default.diskStorage({{
  destination: (_req, _file, cb) => cb(null, CMS_UPLOADS_DIR),
  filename: (_req, file, cb) => {{
    const ext = import_path3.default.extname(file.originalname).toLowerCase();
    const safeExt = CMS_ALLOWED_EXT.has(ext) ? ext : ".jpg";
    cb(null, `cms-${{Date.now()}}-${{import_crypto.default.randomBytes(8).toString("hex")}}${{safeExt}}`);
  }}
}});
function cmsFileFilter(_req, file, cb) {{
  const ext = import_path3.default.extname(file.originalname).toLowerCase();
  if (!CMS_ALLOWED_MIME.has(file.mimetype) || !CMS_ALLOWED_EXT.has(ext)) {{
    return cb(new AppError("\\u0641\\u0642\\u0637 \\u062A\\u0635\\u0627\\u0648\\u06CC\\u0631 JPG\\u060C PNG\\u060C WEBP \\u06CC\\u0627 SVG \\u0645\\u062C\\u0627\\u0632 \\u0647\\u0633\\u062A\\u0646\\u062F", 400));
  }}
  cb(null, true);
}}
var uploadCmsImage = (0, import_multer.default)({{
  storage: cmsStorage,
  fileFilter: cmsFileFilter,
  limits: {{ fileSize: config_default.uploadMaxSizeMb * 1024 * 1024, files: 1 }}
}}).single("image");
async function validateCmsImageMagicBytes(req, res, next) {{
  try {{
    if (!req.file) {{
      throw new AppError("\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u062A\\u0635\\u0648\\u06CC\\u0631 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A", 400);
    }}
    if (req.file.mimetype === "image/svg+xml") {{
      req.file.detectedMime = "image/svg+xml";
      return next();
    }}
    const buffer = Buffer.alloc(4100);
    const fd = import_fs.default.openSync(req.file.path, "r");
    import_fs.default.readSync(fd, buffer, 0, 4100, 0);
    import_fs.default.closeSync(fd);
    const detectedMime = detectMime(buffer);
    if (!detectedMime || !CMS_ALLOWED_MIME.has(detectedMime)) {{
      import_fs.default.unlinkSync(req.file.path);
      throw new AppError("\\u0641\\u0627\\u06CC\\u0644 \\u0622\\u067E\\u0644\\u0648\\u062F \\u0634\\u062F\\u0647 \\u06CC\\u06A9 \\u062A\\u0635\\u0648\\u06CC\\u0631 \\u0645\\u0639\\u062A\\u0628\\u0631 \\u0646\\u06CC\\u0633\\u062A", 400);
    }}
    req.file.detectedMime = detectedMime;
    next();
  }} catch (error) {{
    next(error);
  }}
}}
async function getContent(_req, res) {{
  const content = await getSiteContent();
  res.json({{ success: true, data: content }});
}}
async function saveContent(req, res, next) {{
  try {{
    const content = await updateSiteContent(req.body?.content ?? req.body);
    res.json({{
      success: true,
      message: "\\u0645\\u062D\\u062A\\u0648\\u0627\\u06CC \\u0633\\u0627\\u06CC\\u062A \\u0628\\u0627 \\u0645\\u0648\\u0641\\u0642\\u06CC\\u062A \\u0630\\u062E\\u06CC\\u0631\\u0647 \\u0634\\u062F",
      data: content
    }});
  }} catch (error) {{
    next(error);
  }}
}}
async function uploadMedia(req, res, next) {{
  try {{
    const relativePath = import_path.default.posix.join("uploads", "cms", req.file.filename);
    res.status(201).json({{
      success: true,
      message: "\\u062A\\u0635\\u0648\\u06CC\\u0631 \\u0628\\u0627 \\u0645\\u0648\\u0641\\u0642\\u06CC\\u062A \\u0628\\u0627\\u0631\\u06AF\\u0630\\u0627\\u0631\\u06CC \\u0634\\u062F",
      data: {{
        path: relativePath,
        filename: req.file.filename,
        mimeType: req.file.detectedMime || req.file.mimetype,
        size: req.file.size,
        originalName: req.file.originalname
      }}
    }});
  }} catch (error) {{
    next(error);
  }}
}}
async function removeMedia(req, res, next) {{
  try {{
    const safeName = import_path3.default.basename(req.params.filename);
    if (!safeName || safeName !== req.params.filename) {{
      throw new AppError("\\u0646\\u0627\\u0645 \\u0641\\u0627\\u06CC\\u0644 \\u0646\\u0627\\u0645\\u0639\\u062A\\u0628\\u0631 \\u0627\\u0633\\u062A", 400);
    }}
    const absolutePath = import_path3.default.join(CMS_UPLOADS_DIR, safeName);
    try {{
      await import_promises.default.unlink(absolutePath);
    }} catch (error) {{
      if (error?.code !== "ENOENT") throw error;
    }}
    res.json({{ success: true, message: "\\u062A\\u0635\\u0648\\u06CC\\u0631 \\u062D\\u0630\\u0641 \\u0634\\u062F" }});
  }} catch (error) {{
    next(error);
  }}
}}
var routerContent = (0, import_express2.Router)();
routerContent.get("/", getContent);
routerContent.put("/", requireAuth, authLimiter, saveContent);
var contentRoutes_default = routerContent;
var routerMedia = (0, import_express2.Router)();
routerMedia.post(
  "/",
  requireAuth,
  authLimiter,
  (req, res, next) => {{
    uploadCmsImage(req, res, (err) => handleMulterError(err, req, res, next));
  }},
  validateCmsImageMagicBytes,
  uploadMedia
);
routerMedia.delete("/:filename", requireAuth, authLimiter, removeMedia);
var mediaRoutes_default = routerMedia;
"""


def patch(text: str) -> str:
    if MARKER in text:
        return text

    text = text.replace(
        '      methods: ["GET", "POST", "DELETE", "OPTIONS"],',
        '      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],',
    )

    text = text.replace(
        """var uploadRoutes_default = router2;

// src/routes/index.js""",
        f"""var uploadRoutes_default = router2;
{cms_block()}
// src/routes/index.js""",
    )

    text = text.replace(
        """router3.use("/auth", authRoutes_default);
router3.use("/uploads", uploadRoutes_default);
var routes_default = router3;""",
        """router3.use("/auth", authRoutes_default);
router3.use("/uploads", uploadRoutes_default);
router3.use("/content", contentRoutes_default);
router3.use("/media", mediaRoutes_default);
var routes_default = router3;""",
    )

    if MARKER not in text:
        raise SystemExit("Failed to patch app.cjs — CMS anchors not found")

    return text


def main() -> None:
    ftp = ftplib.FTP("89.39.208.237", timeout=180)
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
        print("uploaded patched app.cjs with CMS")
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
