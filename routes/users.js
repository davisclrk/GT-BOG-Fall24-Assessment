import express from 'express';
import { createUser, loginUser, verifyUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);

export default router;