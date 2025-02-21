
import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware  } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update', authMiddleware.protect, userController.updateUser);
router.get('/profile', authMiddleware.protect, userController.getUserProfile);

export default router;