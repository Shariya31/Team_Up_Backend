import { connectedUsers } from "../index.js";
import { TryCatch } from "../middlewares/error.js";
import { logActivity } from "../middlewares/logActivity.js";
import Task from "../models/Task.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createTask = TryCatch(async (req, res, next) => {
    const { title, description, assignedTo, status, dueDate } = req.body

    if (!title || !description || !assignedTo || !status || !dueDate) return next(new ErrorHandler("Please fill all the fields", 400))

    const task = await Task.create({
        title,
        description,
        assignedTo,
        createdBy: req.user._id,
        status,
        dueDate
    })

    await logActivity(req.user._id, 'Task Created', `Created Task: ${task.title} ${task._id}`);

    const recipientSocketId = connectedUsers.get(assignedTo);
    if (recipientSocketId) {
        req.io.to(recipientSocketId).emit('notification', {
            message: `You have been assigned a new task: "${title}"`,
            taskId: task._id,
        });
    }

    res.status(200).json({
        success: true,
        message: "Task Created",
        task
    });
});

export const getAllTasks = TryCatch(async (req, res, next) => {
    const tasks = await Task.find();
    if (!tasks) return next(new ErrorHandler("Tasks not found", 404));

    res.status(200).json({
        success: true,
        message: "All tasks fetched",
        tasks
    });
});

export const getTaskById = TryCatch(async (req, res, next) => {
    const { id } = req.params

    if (!id) return next(new ErrorHandler("Id not provided", 404))

    const task = await Task.findById(id)

    if (!task) return next(new ErrorHandler("No task found with this id", 404))

    res.status(200).json({
        success: true,
        message: "Task found",
        task
    });
});

export const updateTask = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(ErrorHandler("Id is not provided", 404));

    const { title, description, assignedTo, status, dueDate } = req.body

    if (!title || !description || !assignedTo || !status || !dueDate) return next(ErrorHandler("Please fill all the fields", 400))

    const task = await Task.findByIdAndUpdate(id, {
        title,
        description,
        assignedTo,
        status,
        dueDate,
        updatedAt: Date.now()
    }, { new: true })

    await logActivity(req.user._id, 'Task Updated', `Updated Task: ${task.title} ${task._id}`);

    req.io.emit('taskNotification', {
        message: 'A task was updated',
        task,
    });


    res.status(200).json({
        success: true,
        message: "Task Updated",
        task
    });
});

export const deleteTask = TryCatch(async (req, res, next) => {
    const { id } = req.params

    if (!id) return next(ErrorHandler("Id is not provided", 404));

    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) return next(ErrorHandler(`No Task found with the id: ${id}`))

        await logActivity(req.user._id, 'Task Deleted', `Deleted Task: ${deletedTask.title} ${deletedTask._id}`);

    req.io.emit('taskNotification', {
        message: 'A task was deleted',
        deletedTask,
    });

    res.status(200).json({
        success: true,
        message: "Task Deleted Successfully",
        deletedTask
    });
});