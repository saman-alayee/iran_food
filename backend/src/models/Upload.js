import { getPool } from '../config/db.js';
import { mapUploadRow } from './uploadRow.js';

export async function createUploadRecord(data) {
  const [result] = await getPool().query(
    `INSERT INTO uploads (name, phone, original_name, filename, mime_type, size, path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.phone || '',
      data.originalName,
      data.filename,
      data.mimeType,
      data.size,
      data.path,
    ]
  );
  return findUploadById(result.insertId);
}

export async function findUploadById(id) {
  const [rows] = await getPool().query('SELECT * FROM uploads WHERE id = ? LIMIT 1', [
    Number(id),
  ]);
  return mapUploadRow(rows[0]);
}

export async function listUploadRecords({ skip, limit }) {
  const [rows] = await getPool().query(
    'SELECT * FROM uploads ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, skip]
  );
  return rows.map(mapUploadRow);
}

export async function countUploads() {
  const [rows] = await getPool().query('SELECT COUNT(*) AS total FROM uploads');
  return Number(rows[0]?.total || 0);
}

export async function deleteUploadById(id) {
  const [result] = await getPool().query('DELETE FROM uploads WHERE id = ?', [Number(id)]);
  return result.affectedRows > 0;
}
