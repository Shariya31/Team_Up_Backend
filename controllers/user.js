import Errorhandler from "../Utilities/utility-class.js"
import User from "../models/user.js"
import { TryCatch } from "../middlewares/error.js"
import nodemailer from 'nodemailer'
import crypto from 'crypto'

export const getUserProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user)

    if (!user) return next(new Errorhandler("User Not Found", 404))

    res.status(200).json({
        success: true,
        user,
    })
})

export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(new Errorhandler(`User not found with email ${email}`, 404))

    //generating reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
    .createHash('sha256') // Supported hashing method
    .update(resetToken)
    .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    await user.save({ validateBeforeSave: false })

    //creating reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/password/reset/${resetToken}`

    //generating message

    const message = `You request a password reset. Click on the link to reset your password:\n\n${resetUrl}`

    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        await transporter.sendMail({
            from: 'TeamUp Support <no-reply@teamup.com>',
            to: user.email,
            subject: 'Password Reset Request',
            text: message,
        })

        res.status(200).json({
            success: true,
            message: `Password reset link send to ${email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new Errorhandler('Email could not be sent', 500));
    }
})

export const resetPassword = TryCatch(async (req, res, next) => {
    // Hash the token and compare with the database
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user){
        return next(new Errorhandler("Invalid or Expired reset token", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    });
})

