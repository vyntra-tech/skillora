import { Router } from 'express';
import { getDashboardStats, globalSearch, getPublicStats } from '../controllers/analyticsController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR'), getDashboardStats);
router.get('/search', globalSearch);
router.get('/public-stats', getPublicStats);

export default router;

