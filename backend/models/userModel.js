import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
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
        default: ""
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