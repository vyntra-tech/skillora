import { Router } from 'express';
import {
  getPracticeQuestions,
  createPracticeQuestion,
  updatePracticeQuestion,
  deletePracticeQuestion,
} from '../controllers/practiceController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', getPracticeQuestions);
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createPracticeQuestion);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updatePracticeQuestion);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deletePracticeQuestion);

export default router;

