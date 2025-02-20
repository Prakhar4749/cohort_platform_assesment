import { User } from '../models/userModel.js';
import { CustomError } from '../utils/customError.js';

class AuthService {
    register = async (userData) => {
        const { email } = userData;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new CustomError('User already exists', 400);
        }

        // Create user
        const user = await User.create(userData);
        
        return {
            user: this.sanitizeUser(user),
            token: user.generateAuthToken()
        };
    };

    login = async (email, password) => {
        // Find user
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new CustomError('Invalid credentials', 401);
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new CustomError('Invalid credentials', 401);
        }

        return {
            user: this.sanitizeUser(user),
            token: user.generateAuthToken()
        };
    };

    // Remove sensitive data
    sanitizeUser = (user) => {
        const sanitized = user.toObject();
        delete sanitized.password;
        return sanitized;
    };
}

export const authService = new AuthService();