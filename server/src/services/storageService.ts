import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { config } from '../config';

const hasCloudinary = Boolean(
  config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  console.log('[Storage] Cloudinary initialized.');
} else {
  console.log('[Storage] Cloudinary credentials not provided; using local storage fallback at /uploads');
}

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage for local uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed: JPG, PNG, WEBP, SVG, PDF, DOC.'));
    }
  },
});

export const uploadToCloudinaryOrLocal = async (file: Express.Multer.File, folder = 'talent_platform'): Promise<string> => {
  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'auto',
      });
      // Remove temporary file on disk
      try {
        fs.unlinkSync(file.path);
      } catch {}
      return result.secure_url;
    } catch (err: any) {
      console.warn('[Storage] Cloudinary upload failed, falling back to local file URL:', err.message);
      return `/uploads/${path.basename(file.path)}`;
    }
  }

  // Local URL fallback
  return `/uploads/${path.basename(file.path)}`;
};

