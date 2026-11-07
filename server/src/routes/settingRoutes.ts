import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), updateSettings);

export default router;

