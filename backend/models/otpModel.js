import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // auto-delete after 10 minutes
    }
});

otpSchema.index({ phoneNumber: 1 }, { unique: true });

const otpModel = mongoose.models.otp || mongoose.model('otp', otpSchema);

export default otpModel;
