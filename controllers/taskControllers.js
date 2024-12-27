import Task from '../models/Task.js'
import Errorhandler from '../Utils/Errorhandler.js'
import TryCatch from '../Utils/TryCatch.js'
export const createTask = TryCatch(async (req, res, next) => {
    const { title, description, status, dueDate, assignedTo } = req.body


    if (!title, !description, !status, !dueDate, !assignedTo) return next(new Errorhandler('Please fill all the fields', 400))
    const newTask = await Task.create({
        title,
        description,
        status,
        dueDate,
        assignedTo,
        createdBy: req.user._id
    })

    if (!newTask) return next(new Errorhandler('Unable to create task', 500));


    res.status(200).json({
        success: true,
        message: 'new task created successfully',
        newTask
    })
})

export const getAllTasks = TryCatch(async (req, res, next) => {

    const tasks = await Task.find({ createdBy: req.user._id }).populate('assignedTo', 'name email')
    if (!tasks || tasks.length ===  0) return next(new Errorhandler('No tasks found', 404))

    res.status(200).json({
        success: true,
        message: 'All tasks fetched',
        tasks
    })
})

