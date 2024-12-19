import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide name"]
        },

        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email address',
            ],
        },

        password: {
            type: String,
            required: [true, 'Please enter a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default:  'user'
        },
        
        resetPasswordToken: String,
        resetPasswordExpire: Date
    }
)

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 15*60*1000

    return resetToken
}

const User = mongoose.model('User', userSchema)
export default User;