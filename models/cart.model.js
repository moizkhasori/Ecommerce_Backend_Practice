import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    products:[
        {
            productName: {
                type: mongoose.Schema.Types.ObjectId,
                required:[true, "Please Provide a Product ID"],
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})

export const Cart = mongoose.model("Cart", cartSchema)