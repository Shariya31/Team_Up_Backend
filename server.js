import http from 'http';
import app from './app.js';
import { socketConnect } from './middlewares/socketConnect.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
socketConnect(server)

const mongoUri = process.env.MONGO_URI || ""
connectDB(mongoUri)

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
