
import { Community } from '../models/communityModel.js';
import { Membership } from '../models/membershipModel.js';

// Update community permissions
export const updateCommunityPermissionsService = async (communityId, userId, permissions) => {
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  if (community.owner.toString() !== userId) {
    throw new Error('Not authorized to update permissions');
  }

  community.settings.permissions = {
    ...community.settings.permissions,
    ...permissions
  };

  await community.save();
  return community.settings;
};

// Check user permissions for a community
export const checkUserPermissionsService = async (communityId, userId) => {
  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error('Community not found');
  }

  const membership = await Membership.findOne({
    userId,
    communityId
  });

  let permissions = {
    canView: true,
    canPost: false,
    canChat: false,
    canAddMembers: false,
    canManageSettings: false
  };

  if (!membership || membership.status !== 'active') {
    if (community.type === 'Private') {
      permissions.canView = false;
    }
    return permissions;
  }

  permissions.canPost = community.settings.permissions.canPost;
  permissions.canChat = community.settings.permissions.canChat;
  permissions.canAddMembers = community.settings.permissions.canAddMembers;

  if (membership.role === 'admin' || community.owner.toString() === userId) {
    permissions = {
      canView: true,
      canPost: true,
      canChat: true,
      canAddMembers: true,
      
      canManageSettings: true
    };
  } 

  return permissions;
};
