import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import { ensureDefaultAdmin } from '../services/authService.js';
import config from '../config/index.js';

async function seed() {
  await connectDatabase();
  const admin = await ensureDefaultAdmin();
  console.log('Admin ready:');
  console.log(`  email: ${admin.email}`);
  console.log(`  password: ${config.admin.password} (from .env if newly created)`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
