import { Transaction } from '../models/transactionModel.js';
import { Membership } from '../models/membershipModel.js';
import { Community } from '../models/communityModel.js';
import mongoose from 'mongoose';

export const paymentService = {
  
  async getCommunityTransactions(communityId, userId) {
    // Verify ownership
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    if (community.owner.toString() !== userId) {
      throw new Error('Not authorized to view transactions');
    }
    
    // Get transactions with user details
    const transactions = await Transaction.find({ communityId })
      .populate('userId', 'name username avatar')
      .sort('-transactionDate');
    
    // Calculate summary stats - Fixed ObjectId creation
    const totalUserPayments = await Transaction.aggregate([
      { 
        $match: { 
          communityId: new mongoose.Types.ObjectId(communityId), 
          status: 'success' 
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' } 
        } 
      }
    ]);
    
    return {
      transactions,
      totalAmount: totalUserPayments.length > 0 ? totalUserPayments[0].total : 0
    };
  },
  
    async addPaymentMethod(communityId, paymentData) {
      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }
  
      // Validate payment data based on type
      this._validatePaymentData(paymentData);
  
      // If this is the first payment method, make it default
      if (!community.paymentMethods || community.paymentMethods.length === 0) {
        paymentData.isDefault = true;
      }
  
      // If new method is set as default, remove default from others
      if (paymentData.isDefault) {
        community.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }
  
      community.paymentMethods.push(paymentData);
      await community.save();
  
      return community.paymentMethods[community.paymentMethods.length - 1];
    },
  
    async editPaymentMethod(communityId, paymentMethodId, updateData) {
      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }
  
      const paymentMethod = community.paymentMethods.id(paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
  
      // Validate update data based on type
      this._validatePaymentData(updateData);
  
      // If updating to default, remove default from others
      if (updateData.isDefault && !paymentMethod.isDefault) {
        community.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }
  
      // Update the payment method fields
      Object.assign(paymentMethod, updateData);
      await community.save();
  
      return paymentMethod;
    },
  
    async deletePaymentMethod(communityId, paymentMethodId) {
      const community = await Community.findById(communityId);
      if (!community) {
          throw new Error('Community not found');
      }
  
      const paymentMethod = community.paymentMethods.id(paymentMethodId);
      if (!paymentMethod) {
          throw new Error('Payment method not found');
      }
  
      // If deleting default method, make another one default if available
      if (paymentMethod.isDefault && community.paymentMethods.length > 1) {
          const newDefault = community.paymentMethods.find(m => m._id.toString() !== paymentMethodId);
          if (newDefault) {
              newDefault.isDefault = true;
          }
      }
  
      // Use pull to remove the subdocument
      community.paymentMethods.pull(paymentMethodId);
      await community.save();
  },
  
    async getPaymentMethods(communityId) {
      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }
  
      return community.paymentMethods;
    },
  
    _validatePaymentData(paymentData) {
      const { type } = paymentData;
  
      if (!['card', 'bank', 'upi'].includes(type)) {
        throw new Error('Invalid payment method type');
      }
  
      switch (type) {
        case 'card':
          if (!paymentData.cardDetails?.lastFourDigits || 
              !paymentData.cardDetails?.expiryMonth || 
              !paymentData.cardDetails?.expiryYear) {
            throw new Error('Invalid card details');
          }
          break;
        case 'bank':
          if (!paymentData.bankDetails?.accountNumber || 
              !paymentData.bankDetails?.bankName || 
              !paymentData.bankDetails?.ifscCode) {
            throw new Error('Invalid bank details');
          }
          break;
        case 'upi':
          if (!paymentData.upiDetails?.upiId) {
            throw new Error('Invalid UPI details');
          }
          break;
      }
    }
};