import { Router } from 'express';
import authRoutes from './authRoutes';
import jobRoutes from './jobRoutes';
import companyRoutes from './companyRoutes';
import internshipRoutes from './internshipRoutes';
import categoryRoutes from './categoryRoutes';
import locationRoutes from './locationRoutes';
import skillRoutes from './skillRoutes';
import batchRoutes from './batchRoutes';
import articleRoutes from './articleRoutes';
import practiceRoutes from './practiceRoutes';
import faqRoutes from './faqRoutes';
import toolRoutes from './toolRoutes';
import userRoutes from './userRoutes';
import applicationRoutes from './applicationRoutes';
import settingRoutes from './settingRoutes';
import uploadRoutes from './uploadRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/companies', companyRoutes);
router.use('/internships', internshipRoutes);
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/skills', skillRoutes);
router.use('/batches', batchRoutes);
router.use('/articles', articleRoutes);
router.use('/practice', practiceRoutes);
router.use('/faqs', faqRoutes);
router.use('/tools', toolRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/settings', settingRoutes);
router.use('/uploads', uploadRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

