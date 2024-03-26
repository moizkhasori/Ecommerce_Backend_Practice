import multer from "multer";

export default (err,req,res,next) => {
    err.statusCode ||= 500;
    err.message ||= "Interal Server Error";

    if (err instanceof multer.MulterError) {
        err.statusCode = 400; // Set status code for Multer errors
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}