
import { communityService } from '../services/communityService.js';

export const communityController = {
  async createCommunity(req, res) {
    try {
      const communityData = req.body;
      const community = await communityService.createCommunity(communityData, req.user.id);
      res.status(201).json(community);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  async updateCommunity(req, res) {
    try {
      const communityId = req.params.id;
      const updateData = req.body;
      const updatedCommunity = await communityService.updateCommunity(communityId, updateData, req.user.id);
      res.json(updatedCommunity);
    } catch (error) {
      if (error.message === 'Not authorized to update this community') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  },
  
  async getCommunity(req, res) {
    try {
      const username = req.params.username;
      const userId = req.user ? req.user.id : null;
      const community = await communityService.getCommunity(username, userId);
      res.json(community);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  
  async deleteCommunity(req, res) {
    try {
      const communityId = req.body;
      const result = await communityService.deleteCommunity(communityId, req.user.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Not authorized to delete this community') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  },
  
  async getUserCommunities(req, res) {
    try {
      const communities = await communityService.getUserCommunities(req.user.id);
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};