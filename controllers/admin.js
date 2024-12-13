import { TryCatch } from "../middlewares/error.js";
import ActivityLog from "../models/ActivityLogs.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getActivityLogs = TryCatch(async(req, res, next)=>{
    const logs = await ActivityLog.find().populate('user', 'name email').sort({timestamp: -1})

    if(!logs) return next(ErrorHandler("No logs to be found", 404))

    res.status(200).json({
        success: true, 
        message: 'Logs fetched successfully',
        logs
    })
})