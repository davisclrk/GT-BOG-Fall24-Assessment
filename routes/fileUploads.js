import express from 'express';
import { uploadMiddleware, uploadFile } from '../controllers/fileUploadController.js';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadFile);

export default router;