import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import {Server} from 'socket.io'
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import taskRoutes from './routes/task.js'
import adminRoutes from './routes/admin.js'
import { errorMiddleware } from './middlewares/error.js';
import { attachSocket } from './middlewares/attachSocket.js'


dotenv.config();
const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    transports: ['websocket'],
})

app.use(attachSocket(io));

const connectedUsers = new Map();

io.on('connection', (socket)=>{
    console.log(`A user connected ${socket.id}`)

    socket.on('register', (userId)=>{
        connectedUsers.set(userId, socket.id);
        console.log(`User registered: ${userId} -> ${socket.id}`);
    });

    socket.on('disconnect', ()=>{
        for (const [userId, id] of connectedUsers.entries()) {
            if (id === socket.id) {
                connectedUsers.delete(userId);
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    })
})


const mongoUri = process.env.MONGO_URI || "";

connectDB(mongoUri)

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/task', taskRoutes)
app.use('/api/v1/admin', adminRoutes)

app.get('/', (req, res)=>{
    res.send("sERVER IS WORKING FINE")
})

app.use(errorMiddleware)


server.listen(PORT, ()=>{
    console.log(`App is running on http://localhost:${PORT}`)
})

export {app, server, io, connectedUsers};