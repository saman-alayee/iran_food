import { defaultSiteContent } from '../data/defaultSiteContent.js';
import { SiteContent } from '../models/SiteContent.js';
import { AppError } from '../utils/AppError.js';

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

export async function getSiteContent() {
  let doc = await SiteContent.findOne({ key: 'main' }).lean();
  if (!doc) {
    doc = await SiteContent.create({ key: 'main', content: defaultSiteContent });
    return doc.content;
  }
  return deepMerge(defaultSiteContent, doc.content);
}

export async function updateSiteContent(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new AppError('داده محتوا معتبر نیست', 400);
  }

  const merged = deepMerge(defaultSiteContent, payload);
  const doc = await SiteContent.findOneAndUpdate(
    { key: 'main' },
    { content: merged },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return doc.content;
}
