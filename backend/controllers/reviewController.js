import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Add review
export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment, image } = req.body;
        const userId = req.user.id;

        if (!productId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Valid product ID and rating (1-5) required" });
        }

        // Fetch user name from database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user has purchased AND received this product
        const userOrder = await orderModel.findOne({
            userId,
            "items.productId": productId,
            payment: true // Payment completed
        });

        if (!userOrder) {
            return res.status(403).json({ success: false, message: "You must purchase this product before reviewing" });
        }

        // Check if order is delivered (only then can review)
        const isDelivered = userOrder.status?.toLowerCase() === "delivered";
        if (!isDelivered) {
            return res.status(403).json({ 
                success: false, 
                message: `You can review after order delivery. Current status: ${userOrder.status}` 
            });
        }

        // Check if user has already reviewed this product
        const existingReview = await reviewModel.findOne({
            productId,
            userId
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product" });
        }

        const review = new reviewModel({
            productId,
            userId,
            userName: user.name,
            rating,
            comment: comment || "",
            image: image || "",
            verified: true,
            deliveryVerified: true
        });

        await review.save();
        res.json({ success: true, message: "Review added successfully", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 });
        
        // Calculate average rating
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.json({ success: true, reviews, avgRating, totalReviews: reviews.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update review helpfulness
export const updateReviewHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await reviewModel.findByIdAndUpdate(
            reviewId,
            { $inc: { helpful: 1 } },
            { new: true }
        );
        res.json({ success: true, review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await reviewModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
