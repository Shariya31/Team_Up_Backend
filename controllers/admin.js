import { TryCatch } from "../middlewares/error.js"
import User from "../models/user.js"
import Errorhandler from "../Utilities/utility-class.js"
import ActionLog from '../models/actionLog.js';
import { sendEmail } from "../Utilities/sendEmail.js";

export const getAllUsers = TryCatch(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const cacheKey = 'all_users';
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
        return res.status(200).json({
            success: true,
            users: cachedData,
        });
    }


    const users = await User.find().skip(skip).limit(limit);

    if (!users) {
        return next(new Errorhandler('No users found', 404));
    }

    await setCache(cacheKey, users); 

    const totalUsers = await User.countDocuments();

    res.status(200).json({
        success: true,
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        totalUsers
    });
})


export const deleteUser = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler('User not found', 404));
    }

    await user.deleteOne();

    // Log action
    await ActionLog.create({
        admin: req.user,
        action: 'Deleted User',
        targetUser: user._id,
    });

    try {
        await sendEmail({
            email: user.email,
            subject: 'Account Deletion Notification',
            message: `Hello ${user.name}, your account has been deleted by an admin. If you have questions, please contact support.`,
        });
    } catch (error) {
        console.log('Email notification failed:', error.message);
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});

export const updateUserRole = TryCatch(async (req, res, next) => {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return next(new Errorhandler('Invalid role provided', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Errorhandler('User not found', 404));
    }

    user.role = role;
    await user.save();

    // Log action
    await ActionLog.create({
        admin: req.user,
        action: `Updated User Role to ${role}`,
        targetUser: user._id,
    });

    res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
    });
});

export const getAdminLogs = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10, admin, action, date } = req.query;

    const filter = {};
    if (admin) filter.admin = admin;
    if (action) filter.action = action;
    if (date) filter.createdAt = { $gte: new Date(date) };

    const logs = await ActionLog.find(filter)
        .populate('admin', 'name email')
        .populate('targetUser', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalLogs = await ActionLog.countDocuments(filter);

    res.status(200).json({
        success: true,
        logs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: Number(page),
    });
});