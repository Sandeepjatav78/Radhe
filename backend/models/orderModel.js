import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    slot: { type: String, required: true, default: "Standard Delivery" },
    date: { type: Number, required: true },
    
    // 👇 ADD THIS LINE (To store the rejection reason)
    cancelReason: { type: String, default: "" },
    
    // 👇 Ensure this exists to store the prescription Image URL
    prescriptionUrl: { type: String, default: "" } 
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;