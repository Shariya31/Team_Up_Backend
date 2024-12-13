import express from 'express'
import {createTask, deleteTask, getAllTasks, getTaskById, updateTask} from '../controllers/taskController.js'
import { isAuthenticated, isAuthorized } from '../middlewares/auth.js';
const app = express.Router();

app.post('/create', isAuthenticated, isAuthorized(['user']), createTask)

app.get('/', isAuthenticated, isAuthorized(['user']), getAllTasks)

app.get('/:id', isAuthenticated, isAuthorized(['user']), getTaskById)

app.put("/:id", isAuthenticated, isAuthorized(['user']), updateTask)

app.delete('/:id', isAuthenticated, isAuthorized(['user']), deleteTask)

export default app