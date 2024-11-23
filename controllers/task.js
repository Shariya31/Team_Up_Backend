import { TryCatch } from "../middlewares/error.js";
import Task from "../models/tasks.js";
import Errorhandler from "../Utilities/utility-class.js";

export const createTask = TryCatch(async (req, res, next) => {
    const { title, description, status } = req.body

    if (!title || !description || !status) return next(new Errorhandler("Please fill all the fields", 400))

    const task = await Task.create({
        title,
        description,
        status
    })

    if (!task) return next(new Errorhandler("Somethng went wrong", 500))
    
    req.io.emit('createTask', task)

    res.status(200).json({
        success: true,
        message: 'Taks Created',
        task
    })
})



export const updateTask = TryCatch(async(req, res, next)=>{
    const {title, description, status} = req.body
    const {id} = req.params

    const updatedTask = await Task.findByIdAndUpdate(id, {title, description, status}, {new: true})
    if(!updatedTask) return next(new Errorhandler("Task not found", 404))

    req.io.emit('updateTasks', updatedTask)

    res.status(200).json({
        success: true, 
        message: "Taks updated",
        task:updatedTask
    })
})