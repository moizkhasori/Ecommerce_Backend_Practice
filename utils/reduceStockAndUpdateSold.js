import { Product } from "../models/product.model.js";
import { validateProductIds } from "./validateProductIds.js";

export const reduceProductsStockAndUpdateTotalPieceSoldCount = async (order) => {

    try {
    const productArray = order.products;
    await validateProductIds(productArray)

    // all products valid from above just updata data
    productArray.forEach(async (order) => {
        const foundOrder = await Product.findById(order.productid)
        foundOrder.stock -=1;
        foundOrder.totalPiecesSold +=1;
        await foundOrder.save()
    })
    } catch (error) {
        throw error;
    }
}