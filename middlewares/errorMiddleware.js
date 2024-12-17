export const errorMiddleware = (err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server Error"

     if(err.name === "CastError") err.message = "Invalid ID"

    return res.status(statusCode).json({
        success: false,
        message: message
    });
};
