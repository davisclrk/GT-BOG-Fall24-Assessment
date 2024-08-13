import express from 'express';
import userRoutes from './users.js';
import animalRoutes from './animals.js';
import trainingLogRoutes from './trainingLogs.js';
import adminRoutes from './admin.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/animal', animalRoutes);
router.use('/training', trainingLogRoutes);
router.use('/admin', adminRoutes);

export default router;