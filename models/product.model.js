import mongoose from "mongoose";



const categoryEnum = ['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Outdoor', 'Kids & Nursery'];

const subCategories = {
    "Living Room": ['Sofas', 'Sectionals', 'Coffee Tables', 'End Tables', 'TV Stands', 'Accent Chairs', 'Ottomans & Poufs'],
    "Bedroom": ['Beds', 'Mattresses', 'Dressers & Chests', 'Nightstands', 'Wardrobes & Armoires', 'Bedroom Sets'],
    "Dining Room": ['Dining Tables', 'Dining Chairs', 'Bar Stools', 'Buffets & Sideboards', 'China Cabinets', 'Dining Sets'],
    "Home Office": ['Desks', 'Office Chairs', 'Bookcases & Shelving', 'File Cabinets', 'Office Sets'],
    "Outdoor": ['Patio Sets', 'Outdoor Sofas & Sectionals', 'Outdoor Chairs & Seating', 'Outdoor Tables', 'Outdoor Benches', 'Hammocks & Swings'],
    "Kids & Nursery": ['Cribs & Bassinets', 'Changing Tables', 'Kids Beds', 'Kids Dressers & Chests', 'Kids Desks & Chairs', 'Nursery Gliders & Rockers']
}



const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "product name cannot be empty!"],
        minlength:[4, "product name cannot be shorter than 4 characters!"],
        maxlength:[256, "product name cannnot be larger than 256 characters!"]
    },
    description:{
        type:String,
        required:[true, "description cannot be empty!"],
        minlength:[80, "description cannot be shorter than 80 characters!"],
        maxlength:[1200, "description cannot be larger than 1200 characters!"]
    },
    diamensions: {
        width:{
            type:Number,
            required: [true, "Width must be provided (Inches)!"],
            min: [0, "width cannot be less than 0 inches!"],
            max: [150, "width cannot be greater than 150 inches!"]
        },
        height:{ 
            type:Number,
            required: [true, "Height must be provided (Inches)!"],
            min: [0, "height cannot be less than 0 inches!"],
            max: [100, "height cannot be greater than 100 inches!"]
        }
    },
    weight:{
        magnitude:{
            type: Number,
            required: [true, "Wight must be provided!"],
            min: [0, "weight cannot be less than 0 !"],
            max: [1000, "weight cannot be greater than 1000 !"]
        },
        unit:{
            type: String,
            required: [true, "Unit for weight must be provided (kg | gram)"],
            enum: ["kg", "gram"]
        }
    },
    category:{
        type: String,
        required: [true,"category must be provided!"],
        validate : {
            validator: function(value){
                return categoryEnum.includes(value)
            },
            message: props => `${props.value} is not a supported enum for category!`
        }
    },
    subCategory:{
        type: String,
        required: [true,"sub-category must be provided!"],
        validate: {
            validator: function(value){
                return subCategories[this.category]?.includes(value)
            },
            message: props => `${props.value} is not a valid sub-category for selected category!`
        }
    },
    colors: [{
        _id : false,
        color: {
            type: String,
            required: [true, "Color must be provided!"],
        },
        images: [{
            _id : false,
            publicId: {
                type: String,
            },
            url:{
                type:String,
            }
        }]
    }],
    stock:{
        type: Number,
        required: [true, "Stock must be provided!"],
        min: [1, "stock cannot be less than 1!"],
        max: [1000, "stock cannot be greater than 1000!"]
    },
    totalPiecesSold:{
        type: Number,
        default: 0,
    },
    reviews:{
        type: [{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }]
    },
    price:{
        type: Number,
        required : [true, "Price must be provided!"],
        min: [1, "Price cannot be less than 1!"],
        max: [10000000, "price cannot be greater than 10000000!"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true})

export const Product = mongoose.model("Product", productSchema);


