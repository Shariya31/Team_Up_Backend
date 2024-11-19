import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js';

//Routes import
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

dotenv.config();

const mongoUri = process.env.MONGO_URI || ""

//connect to database
connectDB(mongoUri)

const app = express();


// middlewares
app.use(cors());
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('running')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)

app.use(errorMiddleware)
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`App is running on http://localhost:${PORT}`)
})

export default app