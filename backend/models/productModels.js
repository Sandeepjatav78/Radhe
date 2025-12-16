import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true }, // <--- New Field
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestsellar: { type: Boolean },
    
    // --- PHARMACY NEW FIELDS ---
    saltComposition: { type: String, required: false },
    manufacturer: { type: String, required: true },
    packSize: { type: String, required: true },
    stock: { type: Number, required: true },
    expiryDate: { type: Number },
    batchNumber: { type: String },
    prescriptionRequired: { type: Boolean, default: false },

    date: { type: Number, required: true }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;