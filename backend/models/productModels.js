import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Medicine Name (e.g. Dolo 650)
    description: { type: String, required: true }, // Uses & Side effects
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true }, // e.g. Tablet, Syrup, Injection
    subCategory: { type: String, required: true }, // e.g. Pain Relief, Gastric
    
    // --- Naya Pharmacy Logic ---
    
    // 1. Dawaai ka Salt (Generic Name) - Search ke liye best hai
    saltComposition: { type: String, required: true }, 

    // 2. Company ka naam
    manufacturer: { type: String, required: true }, 

    // 3. Pack size (e.g. "10 Tablets per Strip" or "100ml Bottle")
    packSize: { type: String, required: true },

    // 4. Kya prescription chahiye? (True/False)
    prescriptionRequired: { type: Boolean, default: false },

    // 5. Stock Quantity (Inventory manage karne ke liye)
    stock: { type: Number, required: true, default: 0 },

    // 6. Expiry Date (Optional abhi ke liye, par future me jaruri hai)
    expiryDate: { type: Number }, 
    
    // --- Common Fields ---
    bestsellar: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;