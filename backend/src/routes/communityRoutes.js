
import express from 'express';
import { communityController } from '../controllers/communityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/create', authMiddleware.protect, communityController.createCommunity);

router.get('/user', authMiddleware.protect, communityController.getUserCommunities);

router.get('/:username', communityController.getCommunity);

router.put('/update/:id', authMiddleware.protect, communityController.updateCommunity);

router.delete('/delete/:id', authMiddleware.protect, communityController.deleteCommunity);


export default router;