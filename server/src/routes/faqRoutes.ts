import { Router } from 'express';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', getFaqs);
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createFaq);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateFaq);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteFaq);

export default router;

