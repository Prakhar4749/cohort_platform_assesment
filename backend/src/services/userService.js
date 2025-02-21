
import { User } from '../models/userModel.js';

export const userService = {
  async registerUser(userData) {
    const { email, password, name, username, avatar } = userData;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      throw new Error('User already exists');
    }
    
    const user = await User.create({
      email,
      password,
      name,
      username,
      avatar
    });
    
    if (user) {
      const token = user.generateAuthToken();
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        token
      };
    }
    
    throw new Error('Invalid user data');
  },
  
  async loginUser(credentials) {
    const { email, password } = credentials;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }
    
    const token = user.generateAuthToken();
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      token
    };
  },
  
  async updateUser(userId, updatedData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updatedData);  
    await user.save();
    
    return { user };
},

  
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
};