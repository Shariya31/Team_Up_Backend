import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied. No token provided.',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user from the token payload
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Attach the user to the request object for further use
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token or session expired.',
        });
    }
};

export const isAuthorized = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied. Insufficient permissions.',
            });
        }
        next();
    };
};

