import { Router } from 'express';
import { handleUpload } from '../controllers/uploadController';
import { authenticate, requireRoles } from '../middleware/auth';
import { upload } from '../services/storageService';

const router = Router();

// Allow authenticated users to upload resumes/avatars, and admins to upload logos/articles
router.post('/', authenticate, upload.single('file'), handleUpload);

export default router;

