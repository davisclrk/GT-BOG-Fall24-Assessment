import express from 'express';
import { createAnimal } from '../controllers/animalController.js';

const router = express.Router();

router.post('/', createAnimal);

export default router;