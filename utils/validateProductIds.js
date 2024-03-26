import { Product } from "../models/product.model.js"
import { ErrorHandler } from "./ErrorHandler.js"

export const validateProductIds = async (products, next) => {

    for(const order of products){
        try {
            const product = await Product.findById(order.productid)
            if(!product){
                throw new ErrorHandler(`Invalid Product Id : ${order.productid}`,400)
            }
        } catch (error) {
           throw error;
        }
    }

    return true;

}