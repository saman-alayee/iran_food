import { getPool } from '../config/db.js';
import { defaultSiteContent } from '../data/defaultSiteContent.js';

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch ?? base;
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      out[key] = deepMerge(base[key], value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

async function getStoredPayload() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT payload FROM site_content WHERE id = 1 LIMIT 1');
  if (!rows.length) return null;
  let stored = rows[0].payload;
  if (typeof stored === 'string') stored = JSON.parse(stored);
  return stored;
}

function normalizeNav(payload) {
  if (!Array.isArray(payload.nav)) return payload;
  payload.nav = payload.nav.map((item) => {
    let href = item.href;
    if (item.label === 'درباره ما' || href === '#countdown') href = '#about';
    if (item.label === 'کاربردها' || href === '#apps' || href === '#why') href = '#apps';
    return { ...item, href };
  });
  return payload;
}

function sanitizeCountdownDate(raw) {
  if (!raw || !String(raw).trim()) return '';
  const text = String(raw).trim();
  const parsed = Date.parse(text);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  const faMatch = text.match(/(\d+)\s*روز[\s\S]*?(\d+)\s*ساعت/);
  if (faMatch) {
    const date = new Date();
    date.setDate(date.getDate() + Number(faMatch[1]));
    date.setHours(date.getHours() + Number(faMatch[2]), 0, 0, 0);
    return date.toISOString();
  }
  return '';
}

function sanitizePayload(payload) {
  const out = { ...payload };
  const iso =
    sanitizeCountdownDate(out.countdownTargetDate) || sanitizeCountdownDate(out.countdownTarget);
  if (iso) {
    out.countdownTargetDate = iso;
    out.countdownTarget = iso;
  }

  const appIcons = ['health', 'benchmark', 'api', 'ai', 'app', 'research'];
  const whyLooksLikeApps = /کاربرد/.test(String(out.whyTitle || ''));
  if (!Array.isArray(out.apps) || out.apps.length === 0) {
    if (whyLooksLikeApps && Array.isArray(out.whyCards) && out.whyCards.length) {
      out.apps = out.whyCards.map((card, index) => ({
        title: card.title,
        icon: appIcons[index % appIcons.length],
      }));
      out.appsTitle = out.whyTitle || defaultSiteContent.appsTitle;
      out.whyTitle = defaultSiteContent.whyTitle;
      out.whyCards = defaultSiteContent.whyCards;
    } else {
      out.apps = defaultSiteContent.apps;
    }
  }
  if (!String(out.appsTitle || '').trim()) {
    out.appsTitle = defaultSiteContent.appsTitle;
  }

  return normalizeNav(out);
}

export async function getSiteContent() {
  const stored = await getStoredPayload();
  if (!stored) {
    return { ...defaultSiteContent };
  }
  return sanitizePayload(deepMerge(defaultSiteContent, stored));
}

export async function saveSiteContent(payload) {
  const stored = (await getStoredPayload()) || {};
  const merged = sanitizePayload(deepMerge(deepMerge(defaultSiteContent, stored), payload));
  const pool = getPool();
  await pool.query(
    `INSERT INTO site_content (id, payload) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP`,
    [JSON.stringify(merged)]
  );
  return merged;
}
