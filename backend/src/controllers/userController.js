
import { userService } from '../services/userService.js';

export const userController = {
  async registerUser(req, res) {
    try {
      const userData = req.body;
      const user = await userService.registerUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  async loginUser(req, res) {
    try {
      const credentials = req.body;
      const user = await userService.loginUser(credentials);
      res.json(user);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
  
  async updateUser(req, res) {
    try {
      const { updatedData } = req.body;
      const result = await userService.updateUser(req.user.id, updatedData);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  
  async getUserProfile(req, res) {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};