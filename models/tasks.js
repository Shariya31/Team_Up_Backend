import mongoose, {mongo, Schema} from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ['disolved', 'active', 'completed'],
            default: 'disolved'
        }
    },

    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', taskSchema)

export default Task
