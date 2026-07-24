import { defaultSiteContent } from '../data/defaultSiteContent.js';
import { getPool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const TABLE_SQL = `CREATE TABLE IF NOT EXISTS site_content (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content_key VARCHAR(50) NOT NULL,
  content_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

function deepMerge(base, patch) {
  if (patch === null || patch === undefined) return base;
  if (Array.isArray(patch)) return patch;
  if (typeof patch !== 'object' || Array.isArray(base)) return patch;
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] = deepMerge(base?.[key], value);
  }
  return out;
}

export async function ensureContentTable() {
  await getPool().query(TABLE_SQL);
}

export async function getSiteContent() {
  await ensureContentTable();
  const [rows] = await getPool().query(
    'SELECT content_json FROM site_content WHERE content_key = ? LIMIT 1',
    ['main']
  );
  if (!rows[0]) {
    await getPool().query(
      'INSERT INTO site_content (content_key, content_json) VALUES (?, ?)',
      ['main', JSON.stringify(defaultSiteContent)]
    );
    return defaultSiteContent;
  }
  const parsed = JSON.parse(rows[0].content_json);
  return deepMerge(defaultSiteContent, parsed);
}

export async function updateSiteContent(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new AppError('داده محتوا معتبر نیست', 400);
  }
  await ensureContentTable();
  const merged = deepMerge(defaultSiteContent, payload);
  await getPool().query(
    `INSERT INTO site_content (content_key, content_json)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
    ['main', JSON.stringify(merged)]
  );
  return merged;
}
