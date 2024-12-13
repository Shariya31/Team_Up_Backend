import ActivityLog from "../models/ActivityLogs.js"

export const logActivity = async(userId, action, details = "")=>{
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details
        });
    } catch (error) {
        console.log('Error logging activity', error.message)
    }
}