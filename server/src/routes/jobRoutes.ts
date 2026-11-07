import { Router } from 'express';
import {
  getJobs,
  getClosingSoonJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  duplicateJob,
  updateJobStatus,
} from '../controllers/jobController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getJobs);
router.get('/closing-soon', getClosingSoonJobs);
router.get('/:slug', getJobBySlug);

// Admin only
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createJob);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateJob);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteJob);
router.post('/:id/duplicate', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), duplicateJob);
router.patch('/:id/status', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR'), updateJobStatus);

export default router;

