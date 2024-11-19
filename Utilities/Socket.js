import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('taskUpdated', (data) => {
        io.emit('updateTasks', data); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
