import { Router } from 'express';
import { register, login, getMe, updateProfile, toggleSaveJob } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/jobs/:jobId/save', authenticate, toggleSaveJob);

export default router;

