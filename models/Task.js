import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, "Please provide a task title"]
        },

        description: {
            type: String,
            required: [true, "Please provide a task description"]
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Please assign a user to the task"]
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type : String,
            enum: ["To Do", "In Progress", "Completed"],
            default : "To Do"
        },

        dueDate: {
            type: Date,
            required: [true, "Please provide a due date"]
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
)

const Task = mongoose.model("Task", taskSchema);
export default Task