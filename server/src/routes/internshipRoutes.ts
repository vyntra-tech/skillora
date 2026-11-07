import { Router } from 'express';
import {
  getInternships,
  getInternshipBySlug,
  createInternship,
  updateInternship,
  deleteInternship,
} from '../controllers/internshipController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getInternships);
router.get('/:slug', getInternshipBySlug);

// Admin
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createInternship);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateInternship);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteInternship);

export default router;

