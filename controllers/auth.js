import { TryCatch } from "../middlewares/error.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/user.js"
import Errorhandler from "../Utilities/utility-class.js"

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
}
export const registerUser = TryCatch(async(req, res, next)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password) return next(new Errorhandler("Please provide all the fields", 400))

    const userExists = await User.findOne({email})
    if(userExists) return next(new Errorhandler("User already exists", 400))

    const user = await User.create({
        name, 
        email,
        password
    })

    if(user){
        res.status(201).json({
            success: true,
            message: "User created successfully",
            userData: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token : generateToken(user._id)
            }
        })
    }else{
        return next(new Errorhandler("Invalid User", 400))
    }
})

export const userLogIn = TryCatch(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password) return next(new Errorhandler("Please provide all the fields", 400))

    const user = await User.findOne({email})

    if(!user) return next(new Errorhandler(`There is no user with the email ${email} | Please register first`, 404))

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            success: true,
            message : `Lgoin Successful | Welcome ${user.name}`,
            userData: {
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        })
    }
    else{
       return next(new Errorhandler("Invalid User | Please give correct password", 400))
    }
})
