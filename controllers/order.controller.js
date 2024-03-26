import { TryCatch } from "../middlewares/TryCatch.js";
import { Order } from "../models/order.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { avaliableStatusOptionsToChooseFrom, isUserStatusValidfn } from "../utils/avaliableStatusOptionsToChooseFrom.js";
import { reduceProductsStockAndUpdateTotalPieceSoldCount } from "../utils/reduceStockAndUpdateSold.js";
import { validateProductIds } from "../utils/validateProductIds.js";

export const handleCreateNewOrder = TryCatch( async (req,res,next) => {

    const {street, city, province,postalCode, products} = req.body;

    if(!street || !city || !province || !postalCode || !products){
        return next(new ErrorHandler("All Fields are Mandatory to create an order!",400))
    }
    const orderBy = req.user._id;


    // if invalid product is given, the below function will throw an error which will be handled by TRYCATCH Middleware
    await validateProductIds(products, next)

    // No error from above, just continue
    const order = await Order.create({street, city, province,postalCode, products, orderBy});

    res.status(201).json({
        success:true,
        message: "order placed successfully",
        order
    })
    
} )

export const handleGetSignleOrder = async (req,res,next) => {

    const {id} = req.params;
    if(!id){
        return next(new ErrorHandler("Order Id must be provided!", 400))
    }

    let order = await Order.findById(id);

    if(!order){
        return next(new ErrorHandler(`No Order found with id ${id}, please provide a valid id!`,400))
    }

    res.status(200).json({
        success: true,
        message: "Order Found Successfully!",
        order
    })
}



// admin
export const handleUpdateOrderStatus = TryCatch( async(req,res,next) => {

    const {id} = req.params;
    const {orderStatusToUpdate} = req.query;

    if(!id){
        return next(new ErrorHandler("Order Id must be provided!", 400))
    }

    let order = await Order.findById(id);

    if(!order){
        return next(new ErrorHandler(`No Order found with id ${id}, please provide a valid id!`,400))
    }

    const isUserStatusValid = isUserStatusValidfn(orderStatusToUpdate);

    if(!isUserStatusValid){
        return next(new ErrorHandler("Invalid Status Provided! Please choose from - pending, confirmed, dispatched, delivered", 400))
    }

    const availableStatusOptions = avaliableStatusOptionsToChooseFrom(order.orderStatus)

    if(!(availableStatusOptions.includes(orderStatusToUpdate))){
        return next(new ErrorHandler(`Invalid Status Given, Current Status: ${order.orderStatus}, Status you Gave: ${orderStatusToUpdate}`,400))
    }

    await reduceProductsStockAndUpdateTotalPieceSoldCount(order)
    order.orderStatus = orderStatusToUpdate;

    order = await order.save();
    
    res.status(200).json({
        success: true,
        message: "Order Status Updated Successfully!",
        newOrderStatus : order.orderStatus,
        order
    })

} )


export const handleDeleteSignleOrder = async (req,res,next) => {

    const {id} = req.params;
    if(!id){
        return next(new ErrorHandler("Order Id must be provided!", 400))
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: `Order Deleted Successfully with id ${id}!`,
    })
}
