
import { Membership } from '../models/membershipModel.js';
import { Community } from '../models/communityModel.js';

export const membershipService = {
  async joinCommunity(communityId, userId) {
    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    // Check if already a member
    const existingMembership = await Membership.findOne({
      userId,
      communityId
    });
    
    if (existingMembership) {
      throw new Error('Already a member of this community');
    }
    
    // Create membership
    const membership = await Membership.create({
      userId,
      communityId,
      role: 'member',
      status: 'active',
      subscriptionStatus: community.membershipType === 'Free' ? 'free' : 'pending'
    });
    
    return membership;
  },
  
  async updateMembership(membershipId, updatedData, requesterId) {
    const { role, status, subscriptionStatus } = updatedData;
    
    // Verify the membership exists
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error('Membership not found');
    }
    
    // Check if requester is community admin
    const community = await Community.findById(membership.communityId);
    const requesterMembership = await Membership.findOne({
      userId: requesterId,
      communityId: membership.communityId
    });
    
    const isOwner = community.owner.toString() === requesterId;
    const isAdmin = requesterMembership && requesterMembership.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      throw new Error('Not authorized to update memberships');
    }
    
    // Update membership
    membership.role = role || membership.role;
    membership.status = status || membership.status;
    membership.subscriptionStatus = subscriptionStatus || membership.subscriptionStatus;
    
    await membership.save();
    return membership;
  },
  
  async getCommunityMembers(communityId) {
    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    // Get membership data with user details
    const memberships = await Membership.find({ 
      communityId,
      status: 'active' 
    }).populate('userId', 'name username avatar');
    
    return memberships;
  },
  
  async leaveCommunity(communityId, userId) {
    // Find membership
    const membership = await Membership.findOne({
      userId,
      communityId
    });
    
    if (!membership) {
      throw new Error('Membership not found');
    }
    
    // Check if user is the owner
    const community = await Community.findById(communityId);
    if (community.owner.toString() === userId) {
      throw new Error('Community owner cannot leave. Transfer ownership first.');
    }
    
    await Membership.findByIdAndDelete(membership._id);
    return { message: 'Left community successfully' };
  }
};