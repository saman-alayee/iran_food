import 'dotenv/config';
import fs from 'fs';
import { createApp } from './app.js';
import config from './config/index.js';
import { connectDatabase } from './config/db.js';
import { ensureDefaultAdmin } from './services/authService.js';
import { UPLOADS_DIR } from './utils/paths.js';

async function bootstrap() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  await connectDatabase();
  await ensureDefaultAdmin();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
