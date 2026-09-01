import 'dotenv/config';
import fs from 'fs';
import { createApp } from './src/app.js';
import { connectDatabase } from './src/config/db.js';
import { ensureDefaultAdmin } from './src/services/authService.js';
import { UPLOADS_DIR } from './src/utils/paths.js';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let dbReady = false;

const ready = connectDatabase()
  .then(() => ensureDefaultAdmin())
  .then(() => {
    dbReady = true;
  })
  .catch((err) => {
    console.error('Database bootstrap failed:', err);
  });

const app = createApp();

app.use(async (req, res, next) => {
  await ready;
  if (!dbReady) {
    return res.status(503).json({
      success: false,
      message: 'سرویس API موقتاً در دسترس نیست. تنظیمات MySQL را در .env بررسی کنید.',
    });
  }
  next();
});

export default app;
