
import { gamificationService } from '../services/gamificationService.js';

export const gamificationController = {
  async updateUserLevel(req, res) {
    try {
      const { membershipId } = req.params;
      const level = await gamificationService.updateUserLevel(membershipId, req.body, req.user.id);
      res.json(level);
    } catch (error) {
      res.status(error.message.includes('Not authorized') ? 403 : 400).json({ message: error.message });
    }
  },

  async getCommunityDashboard(req, res) {
    try {
      const { communityId } = req.params;
      const { page, limit } = req.query;
      const dashboard = await gamificationService.getCommunityDashboard(
        communityId,
        parseInt(page) || 1,
        parseInt(limit) || 10
      );
      res.json(dashboard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async awardPoints(req, res) {
    try {
      const { membershipId } = req.params;
      const { activityType } = req.body;
      const updatedLevel = await gamificationService.awardPoints(membershipId, activityType,req.user.id);
      res.json(updatedLevel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};