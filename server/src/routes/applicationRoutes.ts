import { Router } from 'express';
import {
  submitApplication,
  getMyApplications,
  getAdminApplications,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { authenticate, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

// Candidate submit application (optional auth if logged in, or guest with email)
router.post('/', optionalAuth, submitApplication);
router.get('/my', authenticate, getMyApplications);

// Admin review
router.get('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR'), getAdminApplications);
router.patch('/:id/status', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR'), updateApplicationStatus);

export default router;

