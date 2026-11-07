import { Router } from 'express';
import { getTools, createTool, updateTool, deleteTool } from '../controllers/toolController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', getTools);
router.post('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), createTool);
router.put('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN', 'EDITOR'), updateTool);
router.delete('/:id', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), deleteTool);

export default router;

