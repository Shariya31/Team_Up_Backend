import Errorhandler from '../Utils/Errorhandler.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const isAuthenticated = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) return next(new Errorhandler('Not Authenticated | No token found', 401))

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        return next(new Errorhandler('Not authoried token failed', 401))
    }
}