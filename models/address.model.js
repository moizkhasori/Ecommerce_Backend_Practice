import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Title must be provided"]
    },
    addressType:{
        type:String,
        enum: ["shipping", "billing"],
        required:[true, "address type must be provided"]
    },
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
        enum: ["kpk", "punjab", "balochistan", "sindh"],
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
}, {timestamps:true})

export const Address = mongoose.model("Address", addressSchema)