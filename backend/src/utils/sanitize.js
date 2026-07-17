import xss from 'xss';

export function sanitizeString(value = '') {
  return xss(String(value).trim());
}

export function sanitizePhone(value = '') {
  return String(value).replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
}
