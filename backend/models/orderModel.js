import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    
    // --- New Field ---
    // Agar user ne prescription upload kiya hai to uska URL yaha aayega
    prescriptionUrl: { type: String, default: "" } 
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;