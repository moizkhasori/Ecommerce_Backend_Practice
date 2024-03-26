import { TryCatch } from "../middlewares/TryCatch.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSendCookie } from "../utils/CookieAndToken.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { UploadSingleImageToCloudinary, deleteImageFromCloudinary } from "../utils/cloudinary.js";


export const handleRegisterUser = TryCatch( async(req,res,next) => {

    const {firstName,lastName, email, password} = req.body;

    if(!firstName && !lastName && !email && !password ){
        return next(new ErrorHandler("All fields are mandatory to create an account!", 400))
    }

    if(!firstName){
        return next(new ErrorHandler("First name cannot be empty!", 400))
    }

    if(!lastName){
        return next(new ErrorHandler("Last name cannot be empty!", 400))
    
    }

    if(!email){
        return next(new ErrorHandler("Email must be provided!", 400))
    }

    if(!password){
        return next(new ErrorHandler("Password must be provided!", 400))
    }
    
    let user = await User.findOne({email});

    if(user){
        return next(new ErrorHandler("An account with this email already exists! Please Login", 400))
    }

    user = await User.create({firstName, lastName, email, password})

    generateTokenAndSendCookie(user, 201,"User Created Successfully", res);

} )


export const handleLoginUser = TryCatch( async(req,res,next) => {

    const { email, password} = req.body;
    if(!email && !password){
        return next(new ErrorHandler("Both Email and Password are mandatory to login!", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Credentials", 400))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password", 400))
    }

    generateTokenAndSendCookie(user, 200, "User LoggedIn Successfully", res)

} )


export const handleLogoutUser = TryCatch( async (req,res,next) => {

    const options = {
        expires: new Date(Date.now())
    }

    res.status(200).cookie("token", null, options).json({
        success:true,
        message: "User Loggedout Successfully!"
    })
} )


export const handleGetMyProfile = TryCatch(async (req,res,next) => {

    const user = req.user;

    res.status(200).json({
        success:true,
        message:`${user.firstName} ${user.lastName} Profile Found!`,
        user
    })

})

export const handleProfilePicture = TryCatch( async(req,res,next) => {
    if(!req.file){
        return next(new ErrorHandler("Please Provide an image! or a valid image extension!",400))
    }

    const localFilePath = req.file.path;
    const result = await UploadSingleImageToCloudinary(localFilePath);

    if(!result){
        return next(new ErrorHandler("Something went wrong while uploading on cloudinary! check User-handleProfilePictureUpload",500))
    }

    const publicId = result.public_id;
    const url = result.url;
    let user = await User.findById(req.user._id)
    if(!user){
        await deleteImageFromCloudinary(publicId)
        return next(new ErrorHandler("No User found with the provided ID!",400))
    }

    const imageToDelete = user.profileImg.publicId;
    const Dresult = await deleteImageFromCloudinary(imageToDelete)

    user.profileImg.publicId = publicId;
    user.profileImg.url = url;

    user = await user.save()

    return res.json({
        updatedPublicId: user.profileImg.publicId,
        updatedURL: user.profileImg.url,
        deletionStatus: Dresult

    });
} )

export const handleCoverPicture = TryCatch( async(req,res,next) => {
    if(!req.file){
        return next(new ErrorHandler("Please Provide an image! or a valid image extension!",400))
    }

    const localFilePath = req.file.path;
    const result = await UploadSingleImageToCloudinary(localFilePath);

    if(!result){
        return next(new ErrorHandler("Something went wrong while uploading on cloudinary! check User-handleProfilePictureUpload",500))
    }

    const publicId = result.public_id;
    const url = result.url;
    let user = await User.findById(req.user._id)
    if(!user){
        await deleteImageFromCloudinary(publicId)
        return next(new ErrorHandler("No User found with the provided ID!",400))
    }

    const imageToDelete = user.profileImg.publicId;
    const Dresult = await deleteImageFromCloudinary(imageToDelete)

    user.coverImg.publicId = publicId;
    user.coverImg.url = url;

    user = await user.save()

    return res.json({
        updatedPublicId: user.coverImg.publicId,
        updatedURL: user.coverImg.url,
        deletionStatus: Dresult
    });
} )




// Admin Routes
export const handleGetAllUsers = TryCatch(async (req,res,next) => {
    const users = await User.find({})

    if(!users){
        return next(new ErrorHandler("No User Exists"))
    }

    res.status(200).json({
        success:true,
        message:"All Users",
        users
    })
})
