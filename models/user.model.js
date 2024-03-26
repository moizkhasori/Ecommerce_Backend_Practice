import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    firstName : {
        type:String,
        required:[true, "first name cannot be empty!"],
        minlength:[2, "first name cannot be shorter than 2 characters!"],
        maxlength:[8, "first name cannnot be larger than 8 characters!"]
    },
    lastName : {
        type:String,
        required:[true, "last name cannot be empty!"],
        minlength:[2, "last name cannot be shorter than 2 characters!"],
        maxlength:[8, "last name cannnot be larger than 8 characters!"]
    },
    email: {
        type:String, 
        required:[true, "email cannot be empty!"],
        unique: [true, "Account with this emaill already exist! Please Login"],
        maxlength:[256, "email can not be large than 256 characters!"],
        validate: [validator.isEmail, "Please enter a valid email!"]

    },
    password: {
        type: String, 
        required: [true, "password cannot be empty!"],
        minlength : [8, "password must be larger than 8 characters!"],
        select: false,
    },
    profileImg: {
        publicId: {
            type: String,
            default: "ecommerce/userpics/sukxxlemywtv7j9ubzpd"
        },
        url:{
            type:String,
            default: "http://res.cloudinary.com/ddciuxhsy/image/upload/v1711100597/ecommerce/userpics/sukxxlemywtv7j9ubzpd.jpg"
        }
    },
    coverImg: {
        publicId: {
            type: String,
            default: "ecommerce/userpics/sukxxlemywtv7j9ubzpd"
        },
        url:{
            type:String,
            default: "http://res.cloudinary.com/ddciuxhsy/image/upload/v1711100597/ecommerce/userpics/sukxxlemywtv7j9ubzpd.jpg"
        }
    },
    shippingAddress : {
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }],
        validate: {
            validator: function(arr){
                return arr.length <=3;
            },
            message:"You can have a maximum of 3 Shipping Addresses!"
        }
    },
    billingAddress:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }],
        validate: {
            validator: function(arr){
                return arr.length <=3;
            },
            message:"You can have a maximum of 3 Billing Addresses!"
        }
    },
    role: {
        type: String,
        enum : ["user" , "moderator" , "admin"],
        default: "user"
    },
    
}, {timestamps:true})


// encrypting password before saving
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
} )

// Creating JWT Token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET)
}

// Compare Password
userSchema.methods.comparePassword = async function(userProvidedPassword){
    return await bcrypt.compare(userProvidedPassword, this.password)
}

export const User = mongoose.model("User", userSchema)