
import { membershipService } from '../services/membershipService.js';

export const membershipController = {

  async joinCommunity(req, res) {
    try {
      const { communityId } = req.body;
      const membership = await membershipService.joinCommunity(communityId, req.user.id);
      res.status(201).json(membership);
    } catch (error) {
      if (error.message === 'Already a member of this community') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  },
  
  async updateMembership(req, res) {
    try {
      const { membershipId } = req.body;
      const { updatedData }= req.body;
      const membership = await membershipService.updateMembership(membershipId, updatedData, req.user.id);
      res.json(membership);
    } catch (error) {
      if (error.message === 'Not authorized to update memberships') {
        res.status(403).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  },
  
  async getCommunityMembers(req, res) {
    try {
      const { communityId } = req.body;
      const members = await membershipService.getCommunityMembers(communityId);
      res.json(members);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  
  async leaveCommunity(req, res) {
    try {
      const { communityId } = req.body;
      const result = await membershipService.leaveCommunity(communityId, req.user.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Community owner cannot leave. Transfer ownership first.') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(404).json({ message: error.message });
      }
    }
  }
};