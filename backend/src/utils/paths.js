import path from 'path';

export const ROOT_DIR = process.cwd();
export const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
export const CMS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'cms');
