import express from 'express';
import userRoutes from './users.js';
import animalRoutes from './animals.js';
import trainingLogRoutes from './trainingLogs.js';
import adminRoutes from './admin.js';
import getHealth from '../controllers/healthController.js';
import authenticate from '../middleware/authenticate.js';
import fileRoute from './fileUploads.js';


const router = express.Router();

router.use('/health', getHealth);
router.use('/user', userRoutes);
router.use('/animal', authenticate, animalRoutes);
router.use('/training', authenticate, trainingLogRoutes);
router.use('/admin', authenticate, adminRoutes);
router.use('/file', authenticate, fileRoute);


export default router;