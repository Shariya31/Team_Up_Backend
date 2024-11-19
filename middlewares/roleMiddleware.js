import Errorhandler from "../Utilities/utility-class.js"
import User from "../models/user.js"

export const authorize = (...roles)=>{
    return async(req, res, next)=>{
        const user = await User.findById(req.user)
        if(!roles.includes(user.role)){
            return next(new Errorhandler("Not Authorized | Check if you have admin access", 401))
        }
        next();
    }

}