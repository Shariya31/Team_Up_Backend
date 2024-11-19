import jwt from 'jsonwebtoken'
import Errorhandler from '../Utilities/utility-class.js'

export const protect = (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new Errorhandler("Unauthorized User", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(!decoded) return next(new Errorhandler("Unauthorized User", 401))
    
    req.user = decoded.id

    next()
}