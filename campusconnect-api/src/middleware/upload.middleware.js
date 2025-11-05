import multer from 'multer';
import path from 'path';
import {
  ensureUploadsDirs,
  getSubmissionUploadsDir,
} from '../config/upload.config.js';

ensureUploadsDirs();

const sanitizeFilename = (name) => {
  const normalized = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  return normalized || 'file';
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirs();
    cb(null, getSubmissionUploadsDir());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const baseName = sanitizeFilename(path.basename(file.originalname || '', ext));
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  },
});

export const submissionUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
