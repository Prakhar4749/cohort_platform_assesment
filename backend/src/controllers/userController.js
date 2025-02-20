import { userService } from '../services/userService.js';
import { CustomError } from '../utils/customError.js';

class UserController {

    getAllUser = async (req, res) => {
        try {
            const users = await userService.getAllUser();
            if (!users) {
                console.error('User not found', 404);
            }
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            throw new CustomError(error.message, error.statusCode || 400);
        }
    };
    getUserById = async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                console.error('User not found', 404);
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            throw new CustomError(error.message, error.statusCode || 400);
        }
    };

    updateUser = async (req, res) => {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            throw new CustomError(error.message, 400);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const user = await userService.deleteUser(req.params.id);
            if (!user) {
                throw new CustomError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            throw new CustomError(error.message, 400);
        }
    };
}

export const userController = new UserController();
