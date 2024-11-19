import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name']
        },
        email: {
            type: String,
            reuqired: [true, 'Please provide a valid email address'],
            unique: true 
        },
        password: {
            type: String,
            required: [true, 'Please provide a passowrd']
        },
        role: {
            type: String,
            default: 'user'
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true
    }
)

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

const User = mongoose.model('User', UserSchema)

export default User