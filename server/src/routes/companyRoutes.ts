import { Router } from 'express';
import {
  getCompanies,
  getCompanyBySlug,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getCompanies);
router.get('/:slug', getCompanyBySlug);

// Admin
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createCompany);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateCompany);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteCompany);

export default router;

