import multer from "multer"
import path from "path"
import { ErrorHandler } from "./ErrorHandler.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const fileFilter = (req,file,cb) => {

    const allowedFileType = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileType.test(file.mimetype)
    const extname = allowedFileType.test(path.extname(file.originalname).toLowerCase());

    if(mimetype && extname){
        cb(null, true)
    }else{
        cb(new ErrorHandler("Only JPEG, JPG, PNG, or GIF files are allowed.", 400),false)
    }
}

const onError = function(err, next) {
    // if error occuers just call next and pass error
    next(err);
};
  
export const upload = multer({
    storage,
    fileFilter,
    onError
})