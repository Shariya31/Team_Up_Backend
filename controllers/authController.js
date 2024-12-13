import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import Errorhandler from '../utils/errorHandler.js';

export const userRegister = TryCatch(async(req, res, next)=>{

    let  {name, email, password} = req.body

    if(!name || !email || !password) return next(new ErrorHandler("Please fill all the fields", 401))

    let existingUser = await User.findOne({email});
    if(existingUser) return next(new ErrorHandler("User already exists | Try to login", 409))

    let newUser = await User.create({
        name,
        email,
        password
    })

    const token = jwt.sign(
        { id: newUser._id},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(200).json({
        success: true,
        message: "User Created Successfully",
        token,
        data: newUser
    })
})

export const userLogin = TryCatch(async(req, res, next)=>{
    let {email, password} = req.body;

    if(!email || !password) return next(new ErrorHandler("Please fill all the fields", 404))
    
    let user = await User.findOne({email}).select('+password name email role');

    if(!user) return next(new ErrorHandler("User does not exists | Try to register first", 404));

    if(!password || !user.password) return next(new ErrorHandler("Invalid Password or hash", 401))

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) return next(new ErrorHandler("Password is not correct", 409))

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });

    res.status(200).json({
        success: true,
        token,
        message: `Welcome ${user.name}`,
        user
    })
})


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new Errorhandler('User not found with this email', 404));
    }

    const resetToken = user.generateResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/password/reset/${resetToken}`;

    // Email message
    const message = `You have requested to reset your password. Please click the URL to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

    try {
      // Send email
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new Errorhandler('Email could not be sent', 500));
    }
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
};


export const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() }, // Token should not be expired
  });

  if (!user) {
    return next(new ErrorHandler('Invalid or expired token', 400));
  }

  // Set the new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
};

