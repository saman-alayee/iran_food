import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },
    originalName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

uploadSchema.index({ createdAt: -1 });

export const Upload = mongoose.model('Upload', uploadSchema);
