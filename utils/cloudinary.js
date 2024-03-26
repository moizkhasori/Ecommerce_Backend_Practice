import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { ErrorHandler } from './ErrorHandler.js';
import { TryCatch } from '../middlewares/TryCatch.js';
          
cloudinary.config({ 
  cloud_name: 'ddciuxhsy', 
  api_key: '449363692469398', 
  api_secret: 'ruXQEj_BJRtQkR6w7kZbpwMdR9I' 
});


export const UploadSingleImageToCloudinary =  async (localFilePath) => {
    
    try {
        if(!localFilePath){
            throw new ErrorHandler("Please Provide a correct File Path!",400)
        }
        const folder = "ecommerce/userpics"
        const response = await cloudinary.uploader.upload(localFilePath, {folder})
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw error
    }
}

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
    try {

        if(publicId === process.env.DEFAULT_USER_PUBLICID){
            return {result: "ok"}
        }

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw error;
    }
};



export const uploadMultipleImagesToCloudinary = async (filesArray) => {

    try {
        // extact local paths for each image
        // const localpaths = filesArray.map(file => file.path)
        const folder = "ecommerce/productspics"
        const promises = filesArray.map(async file => {
            const result = await cloudinary.uploader.upload(file.path, {folder});
            return {publicId: result.public_id, url: result.url}
        })

        const uploadedImagesInfo = await Promise.all(promises);
        
        return uploadedImagesInfo;

    } catch (error) {
        throw error;
    }


}