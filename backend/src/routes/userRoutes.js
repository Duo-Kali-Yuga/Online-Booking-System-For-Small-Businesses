import express from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import { updateMe } from '../controllers/userController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.patch('/me', protect, upload.single('avatar'), updateMe);

export default router;