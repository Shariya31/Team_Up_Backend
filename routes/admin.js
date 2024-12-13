import express from 'express'
import { getActivityLogs } from '../controllers/admin.js';

const app = express.Router();

app.get('/activitylog', getActivityLogs)

export default app