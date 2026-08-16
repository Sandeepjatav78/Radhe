import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Legacy Clerk ID - kept for existing users, not required for new OTP signups
    clerkId: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        sparse: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        sparse: true,
        unique: true
    },
    name: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
