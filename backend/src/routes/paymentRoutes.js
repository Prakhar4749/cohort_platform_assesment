import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payment transactions
router.get('/community/:communityId/transactions', authMiddleware.protect, paymentController.getCommunityTransactions);

// Payment methods management
router.get('/community/:communityId/methods', 
  authMiddleware.protect, 
  paymentController.getPaymentMethods
);

router.post('/community/:communityId/methods', 
  authMiddleware.protect, 
  paymentController.addPaymentMethod
);

router.put('/community/:communityId/methods/:paymentMethodId', 
  authMiddleware.protect, 
  paymentController.editPaymentMethod
);

router.delete('/community/:communityId/methods/:paymentMethodId', 
  authMiddleware.protect, 
  paymentController.deletePaymentMethod
);
export default router;