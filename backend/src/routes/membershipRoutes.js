
import express from 'express';
import { membershipController } from '../controllers/membershipController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Membership management
router.post('/join', authMiddleware.protect, membershipController.joinCommunity);

router.put('/update', authMiddleware.protect, membershipController.updateMembership);

router.get('/communitymember', authMiddleware.protect, membershipController.getCommunityMembers);

router.delete('/community/leave', authMiddleware.protect, membershipController.leaveCommunity);


export default router;