import mongoose from 'mongoose';

const ActionLogSchema = mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const ActionLog = mongoose.model('ActionLog', ActionLogSchema);

export default ActionLog;
