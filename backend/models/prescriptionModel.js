import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    prescriptionImage: { type: String, required: true }, // Cloudinary URL
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: String, default: null }, // Admin ID
    rejectionReason: { type: String, default: "" },
    pharmacistNotes: { type: String, default: "" },
    expiryDate: { type: Date, default: null }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
