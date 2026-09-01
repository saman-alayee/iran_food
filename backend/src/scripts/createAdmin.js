import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDatabase } from '../config/db.js';
import { createAdmin, findAdminByEmail } from '../models/Admin.js';

const email = process.argv[2];
const name = process.argv[3] || (email ? email.split('@')[0] : 'Admin');
const password = process.argv[4] || crypto.randomBytes(9).toString('base64url');

if (!email) {
  console.error('Usage: node src/scripts/createAdmin.js <email> [name] [password]');
  process.exit(1);
}

async function main() {
  await connectDatabase();
  const existing = await findAdminByEmail(email);
  if (existing) {
    console.log(
      JSON.stringify({
        ok: true,
        exists: true,
        email: existing.email,
        id: existing.id,
        message: 'این ایمیل از قبل ثبت شده است',
      })
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await createAdmin({ name, email, passwordHash });
  console.log(
    JSON.stringify({
      ok: true,
      exists: false,
      email: admin.email,
      name: admin.name,
      id: admin.id,
      password,
    })
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }));
  process.exit(1);
});
