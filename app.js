import express from 'express';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import Errorhandler from './Utils/Errorhandler.js'

//importing routes
import sampleRoutes from './routes/sampleRoute.js'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js';
dotenv.config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI || ""
connectDB(mongoUri)

app.get('/', (req, res) => {
    res.send('Server are working!');
});

app.get('/error', (req, res, next) => {
    // Example of throwing a custom error
    next(new Errorhandler('This is a custom error message', 400));
});

app.use('/api', sampleRoutes)
app.use('/api/auth', userRoutes)

app.use(errorMiddleware)

export default app;
