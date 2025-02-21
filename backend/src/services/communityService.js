
import { Community } from '../models/communityModel.js';
import { Membership } from '../models/membershipModel.js';
import mongoose from 'mongoose';

export const communityService = {
    
  async createCommunity(communityData, userId) {
    const { 
      name, 
      username, 
      type, 
      membershipType,
      description,
      country,
      images,
      settings,
      socialAccounts
    } = communityData;
    
    // Check if community with same username exists
    const communityExists = await Community.findOne({ username });
    if (communityExists) {
      throw new Error('Community username already exists');
    }
    
    const community = await Community.create({
      name,
      username,
      type: type || 'Public',
      membershipType: membershipType || 'Free',
      description,
      country,
      images: images || [],
      owner: userId,
      settings: settings || {
        permissions: {
          canPost: true,
          canChat: true,
          canAddMembers: false
        }
      },
      socialAccounts: socialAccounts || {}
    });
    
    // Automatically add creator as admin
    await Membership.create({
      userId,
      communityId: community._id,
      role: 'admin',
      status: 'active'
    });
    
    return community;
  },
  
  async updateCommunity(communityId, updatedData, userId) {
    // Verify ownership
    const community = await Community.findById(communityId);
    if (!community) {
        throw new Error('Community not found');
    }

    if (community.owner.toString() !== userId) {
        throw new Error('Not authorized to update this community');
    }

    
    Object.assign(community, updatedData);
    
    await community.save();
    
    return community;
},

  async getCommunity(username, userId = null) {
    const community = await Community.findOne({ username })
      .populate('owner', 'name username avatar');
      
    if (!community) {
      throw new Error('Community not found');
    }
    
    // Get membership count
    const memberCount = await Membership.countDocuments({ 
      communityId: community._id,
      status: 'active'
    });
    
    // Check if requesting user is a member
    let userMembership = null;
    if (userId) {
      userMembership = await Membership.findOne({
        userId,
        communityId: community._id
      });
    }
    
    return { 
      ...community.toObject(), 
      memberCount,
      userMembership: userMembership ? userMembership.toObject() : null
    };
  },
  
  async deleteCommunity(communityId, userId) {
    // Verify ownership
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    if (community.owner.toString() !== userId) {
      throw new Error('Not authorized to delete this community');
    }
    
    // Delete community and all memberships
    await Promise.all([
      Community.findByIdAndDelete(communityId),
      Membership.deleteMany({ communityId })
    ]);
    
    return { message: 'Community deleted successfully' };
  },
  
  async getUserCommunities(userId) {
    // Get communities the user owns
    const ownedCommunities = await Community.find({ owner: userId });
    
    // Get communities the user is a member of
    const memberships = await Membership.find({ 
      userId,
      status: 'active'
    }).populate('communityId');
    
    const memberCommunities = memberships.map(m => m.communityId);
    
    return {
      owned: ownedCommunities,
      joined: memberCommunities
    };
  }
};