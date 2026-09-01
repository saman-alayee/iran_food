export function mapUploadRow(row) {
  if (!row) return null;
  const id = String(row.id);
  return {
    id: row.id,
    _id: id,
    name: row.name,
    phone: row.phone,
    originalName: row.original_name,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.size,
    path: row.path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
