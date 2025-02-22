
import express from 'express';
import { permissionController } from '../controllers/permissionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Permission management
router.put('/community/:communityId', authMiddleware.protect, permissionController.updateCommunityPermissions);

router.get('/community/:communityId/user', authMiddleware.protect, permissionController.checkUserPermissions);



export default router;