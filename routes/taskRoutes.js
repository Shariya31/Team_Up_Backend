import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createTask, getAllTasks } from '../controllers/taskControllers.js';

const router = express.Router();

router.post('/tasks', isAuthenticated, createTask)
router.get('/tasks', isAuthenticated, getAllTasks)

export default router