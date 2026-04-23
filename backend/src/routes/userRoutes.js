import express from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import { updateMe } from '../controllers/userController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// The upload.single('avatar') must match the key name 
// you used in your frontend: userData.append('avatar', avatarFile);
router.patch('/me', protect, upload.single('avatar'), updateMe);

export default router;