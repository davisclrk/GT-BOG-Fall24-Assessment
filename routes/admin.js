import express from 'express';
import { getUsers, getAnimals, getTrainingLogs } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/animals', getAnimals);
router.get('/training', getTrainingLogs);

export default router;