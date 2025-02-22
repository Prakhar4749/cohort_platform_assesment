
import express from 'express';
import { gamificationController } from '../controllers/gamificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Leaderboard routes
router.get('/leaderboard/:communityId', authMiddleware.protect, gamificationController.getCommunityDashboard);


// Level management routes
router.put('/level/:membershipId', authMiddleware.protect, gamificationController.updateUserLevel);

router.post('/points/:membershipId', authMiddleware.protect, gamificationController.awardPoints);

export default router;