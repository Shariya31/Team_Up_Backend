import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js';

//Routes import
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import taskRoutes from './routes/task.js'

dotenv.config();

const mongoUri = process.env.MONGO_URI || ""

//connect to database
connectDB(mongoUri)

const app = express();

// Create HTTP server from the Express app
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (adjust for production security)
    },
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Real-time task creation
    socket.on('taskCreated', (data) => {
        console.log('Task Created:', data);
        io.emit('createTask', data); // Broadcast to all connected clients
    });

    // Real-time task updates
    socket.on('taskUpdated', (data) => {
        console.log('Task updated:', data);
        io.emit('updateTasks', data); // Broadcast to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// middlewares
app.use(cors());
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('running')
})

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);

app.use(errorMiddleware)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});

