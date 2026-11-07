import { Router } from 'express';
import { getUsers, updateUserRole, toggleUserBlock, deleteUser } from '../controllers/userController';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), getUsers);
router.patch('/:id/role', authenticate, requireRoles('SUPER_ADMIN'), updateUserRole);
router.patch('/:id/block', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), toggleUserBlock);
router.delete('/:id', authenticate, requireRoles('SUPER_ADMIN'), deleteUser);

export default router;

