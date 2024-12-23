import {Server} from 'socket.io'

export const socketConnect = (server)=>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    })
    
    io.on('connection', (socket)=>{
        console.log(`A user connected: ${socket.id}`);
    
        socket.on('update-task', (taskData) => {
            io.emit('task-updated', taskData);
        });
    
        socket.on('create-task', (taskData) => {
            io.emit('new-task', taskData);
        });
    
        socket.on('delete-task', (taskId) => {
            io.emit('task-deleted', taskId);
        });
    
        socket.on('disconnect', ()=>{
            console.log(`User disconnected: ${socket.id}`)
        })
    })
}