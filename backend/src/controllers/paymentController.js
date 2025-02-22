// controllers/paymentController.js
import { paymentService } from '../services/paymentService.js';

export const paymentController = {
  
  
  async getCommunityTransactions(req, res) {
    try {
      const { communityId } = req.params;
      const result = await paymentService.getCommunityTransactions(communityId, req.user.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Not authorized to view transactions') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  },
    async addPaymentMethod(req, res) {
      try {
        const { communityId } = req.params;
        const result = await paymentService.addPaymentMethod(communityId, req.body);
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    async editPaymentMethod(req, res) {
      try {
        const { communityId, paymentMethodId } = req.params;
        const result = await paymentService.editPaymentMethod(communityId, paymentMethodId, req.body);
        res.json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    async deletePaymentMethod(req, res) {
      try {
        const { communityId, paymentMethodId } = req.params;
        await paymentService.deletePaymentMethod(communityId, paymentMethodId);
        res.json({ message: 'Payment method deleted successfully' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    async getPaymentMethods(req, res) {
      try {
        const { communityId } = req.params;
        const paymentMethods = await paymentService.getPaymentMethods(communityId);
        res.json(paymentMethods);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
};