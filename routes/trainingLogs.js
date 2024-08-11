import express from 'express';
import { createTrainingLog } from '../controllers/trainingLogController.js';

const router = express.Router();

router.post('/', createTrainingLog);

export default router;