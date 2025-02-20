import { User } from '../models/userModel.js';

class UserService {
    getAllUser = async () => {
        try {
            return await User.find();
        } catch (error) {
            throw error;
        }
    };

    getUserById = async (id) => {
        try {
            return await User.findById(id);
        } catch (error) {
            throw error;
        }
    };

    updateUser = async (id, updateData) => {
        try {
            return await User.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    };

    deleteUser = async (id) => {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    };
}

export const userService = new UserService();