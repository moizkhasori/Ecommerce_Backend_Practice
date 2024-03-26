import { User } from "../models/user.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { TryCatch } from "./TryCatch.js";
import jwt from "jsonwebtoken";


export const restrictToLoggedInUserOnly = TryCatch( async (req,res,next) => {

    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login First to access this resource!", 401))
    }
    const decodedUserId = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedUserId.id)

    if(!user){
        return next(new ErrorHandler("Cannot Find User with these credentials!", 401))
    }
    
    req.user = user;
    next()
} )
