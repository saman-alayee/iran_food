import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
