import { authService } from '../services/authService.js';

class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body);
            
            res.status(201).json({
                success: true,
                data: { user, token }
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);
            
            res.status(200).json({
                success: true,
                data: { user, token }
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export const authController = new AuthController();