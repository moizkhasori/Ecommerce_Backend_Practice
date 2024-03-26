import { TryCatch } from "../middlewares/TryCatch.js";
import { Product } from "../models/product.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { uploadMultipleImagesToCloudinary } from "../utils/cloudinary.js";
import {unlinkImages} from "../utils/UnlinkImages.js"


// Normal User Controllers - (can also be used by admins)

export const handleFindOneProduct = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Id must be provided"))
    }

    const product = await Product.findById(id)

    if (!product) {
        return next(new ErrorHandler("Product not found! Invalid ID"))
    }

    res.status(200).json({
        success: true,
        message: "product found",
        product
    })

})

export const handleFindAllProduct = TryCatch(async (req, res, next) => {

    // create a dyanmic filling filter query obj and 2 vars
    const filterQuery = {};
    let field;
    let order;

    // a filter map to check values
    const filterMap = {
        lowtohigh: { filter: "price", value: 1 },
        hightolow: { filter: "price", value: -1 },
        latest: { filter: "createdAt", value: -1 },
        topselling: { filter: "totalPiecesSold", value: -1 }
    };

    // if query has category add to my query ovj
    if(req.query.category){
        filterQuery.category = req.query.category;
    }


    // if query has subCategory add to my query ovj
    if(req.query.subCategory){
        filterQuery.subCategory = req.query.subCategory;
    }

    // if sorting given else default sorting by latest
    if(req.query.filter && req.query.filter in filterMap){
       const {filter, value} = filterMap[req.query.filter];
       field = filter;
       order = value;
    }else{
        field = "createdAt";
        order = -1;
    }

    const sortObj = {};
    sortObj[field] = order;

    // limiting and sorting
    const defaultLimit = 50;
    const limit = ( req.query.limit && parseInt(req.query.limit) <= defaultLimit ) ? parseInt(req.query.limit) : defaultLimit
    const currentPage = parseInt(req.query.page) || 1;
    const skip = limit * (currentPage - 1);
    const products = await Product.find(filterQuery).sort(sortObj).limit(limit).skip(skip)

    if (!products) {
        return next(new ErrorHandler("No Product Exists"))
    }

    res.status(200).json({
        success: true,
        message: "All Products",
        length : products.length,
        products,
        limit,
        skip
    })

})




// Admin Controllers

// Create a new product
export const handleCreateNewProduct = async (req, res, next) => {

    try {

        
        if(!req.files || req.files.length === 0){
            throw new ErrorHandler("No files were uploaded!", 400)
        }

        if(!req.body){
            throw new ErrorHandler("Please provide product details, No body given! ", 400)
        }
        
        const { name, description, width, height, magnitude, unit, price, category, subCategory, color, stock, createdBy } = req.body;

        if (!name || !description || !width || !height || !magnitude || !unit || !price || !category || !subCategory || !color || !stock || !createdBy) {
            throw new ErrorHandler("All fields are mandatory to create a product!", 400)
        }

        const cloudinaryUploadedImagesInfo = await uploadMultipleImagesToCloudinary(req.files)

        let product = new Product({
            name,
            description,
            price,
            category,
            subCategory,
            stock,
            createdBy,
            diamensions: {
                width,
                height
            },
            weight: {
                unit,
                magnitude
            },
            colors: [{
                color,
                images: cloudinaryUploadedImagesInfo,
            }]
        })

        product = await product.save()

        res.status(201).json({
            success: true,
            message: "product created successfully",
            product
        })
        unlinkImages(req.files)

    } catch (error) {
        unlinkImages(req.files)
        error.statusCode ||= 500;
        error.message ||= "Interal Server Error";

        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        })
    }

}


//  Delte a Product
export const handleDeleteProduct = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Id must be provided"))
    }

    const product = await Product.findById(id)
    if (!product) {
        return next(new ErrorHandler("Product not found! Invalid ID"))
    }

    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: "product deleted successfully",
    })

})


// My All products
export const handleAllProductsOfOneUser = TryCatch(async (req, res, next) => {

    const {id} = req.body;

    if(!id){
        return next(new ErrorHandler("User Id must be provided!", 400));
    }

    const products = await Product.find({createdBy: id})

    if(!products){
        return next(new ErrorHandler("No Products found! Please create one!", 400))
    }

    res.status(200).json({
        success: true,
        message: `All products created by user:- ${id} are listed below!`,
        products,
    })

})



