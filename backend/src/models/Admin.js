import { getPool } from '../config/db.js';
import { mapAdminRow } from './adminRow.js';

export async function findAdminByEmail(email, { includePassword = false } = {}) {
  const [rows] = await getPool().query(
    'SELECT * FROM admins WHERE email = ? LIMIT 1',
    [email.toLowerCase()]
  );
  return mapAdminRow(rows[0], { includePassword });
}

export async function findAdminById(id) {
  const [rows] = await getPool().query('SELECT * FROM admins WHERE id = ? LIMIT 1', [
    Number(id),
  ]);
  return mapAdminRow(rows[0]);
}

export async function createAdmin({ name, email, passwordHash }) {
  try {
    const [result] = await getPool().query(
      'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), passwordHash]
    );
    return findAdminById(result.insertId);
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      error.code = 11000;
    }
    throw error;
  }
}
