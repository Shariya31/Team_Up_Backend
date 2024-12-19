import User from "../models/User.js";
import Errorhandler from "../Utils/Errorhandler.js";
import TryCatch from "../Utils/TryCatch.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmail from "../Utils/sendEmail.js";
import crypto from 'crypto'

export const registerUser = TryCatch(async(req, res, next)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password) return next(new Errorhandler('Please fill all the fields', 400))

    const userExist = await User.findOne({email})
    if(userExist) return next(new Errorhandler('User already exists | Try to login', 400))

    const newUser = await User.create({
        name,
        email, 
        password
    })

    if(!newUser) return next(new Errorhandler('Error in creating the user', 500))

    res.status(201).json({
        success: true,
        message: "User is created successfully",
        newUser
    })
})

export const loginUser = TryCatch(async(req, res, next)=>{
    const {email, password} = req.body;
    
    if(!email || !password) return next(new Errorhandler("Please fill all the fields", 400))
    
    const user = await User.findOne({email}).select('password name');

    if(!user) return next (new Errorhandler('No user found with this email', 404));

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) return next(new Errorhandler('Password is not correct', 401));

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.status(200).json({
        success: true,
        message: `Login Successful | Welcome ${user.name}`,
        token
    })
})


export const forgotPassword = TryCatch(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Errorhandler('User with this email does not exist', 404));
  }

  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false });

  // Constructing the reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-passowrd/${resetToken}`;

  const message = `You have requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  // Send the email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Errorhandler('Failed to send email', 500));
  }
});

export const resetPassword = TryCatch(async(req, res, next)=>{
    const {token} = req.params;
    const {password} = req.body;

    if(!token) return next(new Errorhandler("Reset Password Token Not Found", 404));

    if(!password) return next(new Errorhandler('Please provide a new password', 409));

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user) return next(new Errorhandler("No user found | Invalid or Expired Token", 404))
    
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful'
    })
})
