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
    
    // Delivery & Coupon fields
    deliveryFee: { type: Number, default: 10 },
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 },
    
    // Cancellation & Prescription
    cancelReason: { type: String, default: "" },
    prescriptionUrl: { type: String, default: "" } 
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;