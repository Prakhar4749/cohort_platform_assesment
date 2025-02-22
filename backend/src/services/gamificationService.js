
import { Membership } from '../models/membershipModel.js';
import { Community } from '../models/communityModel.js';

export const gamificationService = {
  async updateUserLevel(membershipId, updateData, userId) {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error('Membership not found');
    }

    // Verify if user has permission to update
    const community = await Community.findById(membership.communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    const isAdmin = community.owner.toString() === userId;
    if (!isAdmin) {
      throw new Error('Not authorized to update levels');
    }

    const { points, level } = updateData;
    let updatedLevel = membership.level;

    if (points) {
      updatedLevel.points = (updatedLevel.points || 0) + points;
      
      // Level calculation logic
      const pointsPerLevel = 100;
      const newLevel = Math.floor(updatedLevel.points / pointsPerLevel) + 1;
      
      if (newLevel > updatedLevel.currentLevel) {
        updatedLevel.currentLevel = newLevel;
        updatedLevel.progress = 0;
      } else {
        updatedLevel.progress = (updatedLevel.points % pointsPerLevel) / pointsPerLevel * 100;
      }
    }

    if (level) {
      updatedLevel = { ...updatedLevel, ...level };
    }

    membership.level = updatedLevel;
    await membership.save();

    return membership.level;
  },

  async getCommunityDashboard(communityId) {
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
  
    // Get all active members
    const members = await Membership.find({
      communityId,
      status: 'active'
    })
    .select('userId level.points level.current level.progress')
    .populate('userId', 'username avatar')
    .lean();
  
    // Define fixed levels structure
    const levels = {
      5: { title: 'Expert', requiredPoints: 2000, users: [], color: '#FFD700' },
      4: { title: 'Advanced', requiredPoints: 1000, users: [], color: '#C0C0C0' },
      3: { title: 'Intermediate', requiredPoints: 2000, users: [], color: '#CD7F32' },
      2: { title: 'Beginner', requiredPoints: 500, users: [], color: '#4A90E2' },
      1: { title: 'Novice', requiredPoints: 0, users: [], color: '#98A2B3' }
    };
  
    // Group members by their levels
    members.forEach(member => {
      const currentLevel = Math.min(Math.max(member.level?.current || 1, 1), 5);
      
      const userInfo = {
        username: member.userId?.username || 'Unknown',
        avatar: member.userId?.avatar || '',
        points: member.level?.points || 0,
        progress: member.level?.progress || 0,
        currentLevel
      };

      // Ensure levels[currentLevel] exists before pushing
      if (levels[currentLevel]) {
        levels[currentLevel].users.push(userInfo);
      }
    });
  
    // Sort users within each level by points
    Object.keys(levels).forEach(level => {
      levels[level].users.sort((a, b) => b.points - a.points);
    });

    return { levels };
},


  async awardPoints(membershipId, activityType,userId) {
    const pointsMap = {
      'post_creation': 10,
      'comment': 5,
      'reaction': 2,
      'attendance': 15,
      'challenge_completion': 25
    };

    const points = pointsMap[activityType] || 0;
    if (points === 0) {
      throw new Error('Invalid activity type');
    }

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error('Membership not found');
    }

    return this.updateUserLevel(membershipId, { points }, userId);
  }
};