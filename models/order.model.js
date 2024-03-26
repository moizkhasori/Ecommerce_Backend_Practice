import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    street:{
        type:String,
        required:[true, "Street must be provided"]
    },
    city:{
        type:String,
        required:[true, "City must be provided"]
        
    },
    province:{
        type:String,
        enum: ["kpk", "punjab", "balochistan", "sindh", "federal"],
        required:[true, "Province must be provided"]
    },
    postalCode: {
        type:String,
        required:[true, "Postal Code must be provided"]
    },
    country:{
        type:String,
        default:"pakistan"
    },
    products:[
        
        {
            _id:false,
            productid :{
                type:mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderStatus:{
        type:String,
        enum : ["pending", "confirmed", "dispatched" , "delivered"],
        default : "pending"
    },
    paymentMethod: {
        type: String,
        enum : ["cod", "banktransfer"],
        default : "cod"

    }
}, {timestamps:true})

export const Order = mongoose.model("Order", orderSchema);