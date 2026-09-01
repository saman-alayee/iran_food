export function mapAdminRow(row, { includePassword = false } = {}) {
  if (!row) return null;
  const admin = {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (includePassword) {
    admin.passwordHash = row.password_hash;
  }
  return admin;
}
