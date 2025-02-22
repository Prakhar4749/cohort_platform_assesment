
import {
    updateCommunityPermissionsService,
    checkUserPermissionsService
  } from '../services/permissionService.js';
  
  // Update community permissions
  export const permissionController = {
     updateCommunityPermissions: async (req, res) => {
    try {
      const { communityId } = req.params;
      const { permissions } = req.body;
  
      const updatedPermissions = await updateCommunityPermissionsService(communityId, req.user.id, permissions);
      res.json(updatedPermissions);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  // Check user permissions for a community
   checkUserPermissions: async (req, res) => {
    try {
      const { communityId } = req.params;
  
      const permissions = await checkUserPermissionsService(communityId, req.user.id);
      res.json(permissions);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
  