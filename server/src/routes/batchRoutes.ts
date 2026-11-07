import { Router } from 'express';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batchController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', getBatches);
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createBatch);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateBatch);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteBatch);

export default router;

