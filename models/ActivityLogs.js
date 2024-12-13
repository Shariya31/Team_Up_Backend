import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        
        action: {
            type: String,
            required: true,
            enum: ['Task Created', 'Task Updated', 'Task Deleted', 'User Login', 'User Logout'],
        },

        details: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)

export default ActivityLog