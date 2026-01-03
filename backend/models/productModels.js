import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    
    // Pharmacy Fields
    saltComposition: { type: String },
    manufacturer: { type: String },
    prescriptionRequired: { type: Boolean, default: false },
    bestsellar: { type: Boolean, default: false },
    
    // Variants Array
    variants: [
        {
            size: { type: String, required: true }, 
            price: { type: Number, required: true },
            mrp: { type: Number, required: true },
            stock: { type: Number, required: true },
            batchNumber: { type: String } 
        }
    ],

    date: { type: Number, required: true }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;