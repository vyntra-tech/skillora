import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinaryOrLocal } from '../services/storageService';

export const handleUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = req.body.folder || 'general';
    const fileUrl = await uploadToCloudinaryOrLocal(req.file, folder);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

