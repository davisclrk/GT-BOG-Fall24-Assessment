import express from 'express';
import userRoutes from './users.js';
import animalRoutes from './animals.js';
import trainingLogRoutes from './trainingLogs.js';
import adminRoutes from './admin.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/animal', authenticate, animalRoutes);
router.use('/training', authenticate, trainingLogRoutes);
router.use('/admin', authenticate, adminRoutes);

export default router;