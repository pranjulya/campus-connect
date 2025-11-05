import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const uploadsDir = path.join(rootDir, 'uploads');
const submissionUploadsDir = path.join(uploadsDir, 'submissions');

export const ensureUploadsDirs = () => {
  [uploadsDir, submissionUploadsDir].forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

export const getUploadsDir = () => uploadsDir;

export const getSubmissionUploadsDir = () => submissionUploadsDir;

export const getSubmissionPublicPath = (filename) =>
  path.posix.join('uploads', 'submissions', filename);
