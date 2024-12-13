export const attachSocket = (io)=>{
    return (req, res, next)=>{
        req.io = io;
        next()
    }
}