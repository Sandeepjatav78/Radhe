import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 200 },
    image: { type: String, default: "" }, // Cloudinary image URL
    createdAt: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }, // Count of helpful votes
    verified: { type: Boolean, default: false }, // Purchased & delivered
    deliveryVerified: { type: Boolean, default: false } // Order delivered
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
