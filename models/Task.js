import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            required: [true, 'Please enter the task title']
        },

        description: {
            type: String,
            required: [true, 'Please enter a description']
        },

        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending'
        },

        dueDate: {
            type: Date
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', taskSchema);
export default Task;