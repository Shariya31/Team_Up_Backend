import  express from 'express'
import { createTask, updateTask } from '../controllers/task.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const app = express.Router();
http://localhost:5000/api/v1/task/create
app.post('/create',protect, authorize('admin'), createTask)

http://localhost:5000/api/v1/task/update/id
app.put('/update/:id',protect, authorize('admin'), updateTask)



export default app