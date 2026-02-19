import wishlistModel from "../models/wishlistModel.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID required" });
        }

        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = new wishlistModel({
                userId,
                items: [{ productId }]
            });
            console.log(`[DEBUG] New wishlist created for user: ${userId}, added product: ${productId}`);
        } else {
            // Check if item already in wishlist
            const itemExists = wishlist.items.some(item => item.productId === productId);
            if (itemExists) {
                console.log(`[DEBUG] Product ${productId} already in wishlist for user ${userId}`);
                return res.status(200).json({ success: false, message: "Already in wishlist" });
            }
            wishlist.items.push({ productId });
            console.log(`[DEBUG] Product ${productId} added to wishlist for user ${userId}. Total items: ${wishlist.items.length}`);
        }

        await wishlist.save();
        res.json({ success: true, message: "Added to wishlist", wishlist });
    } catch (error) {
        console.error("[ERROR] Add to wishlist error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID required" });
        }

        const wishlist = await wishlistModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );

        if (!wishlist) {
            console.log(`[DEBUG] Wishlist not found for user: ${userId}`);
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        console.log(`[DEBUG] Product ${productId} removed from wishlist for user ${userId}. Remaining items: ${wishlist.items.length}`);
        res.json({ success: true, message: "Removed from wishlist", wishlist });
    } catch (error) {
        console.error("[ERROR] Remove from wishlist error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const wishlist = await wishlistModel.findOne({ userId });
        console.log(`[DEBUG] Fetching wishlist - User: ${userId}, Items count: ${wishlist?.items?.length || 0}`);
        
        res.json({ success: true, wishlist: wishlist || { userId, items: [] } });
    } catch (error) {
        console.error("[ERROR] Get wishlist error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if product in wishlist
export const isInWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID required" });
        }

        const wishlist = await wishlistModel.findOne({ userId });
        const inWishlist = wishlist?.items?.some(item => item.productId === productId) || false;

        console.log(`[DEBUG] Wishlist check - User: ${userId}, Product: ${productId}, InWishlist: ${inWishlist}`);
        
        res.json({ success: true, inWishlist });
    } catch (error) {
        console.error("[ERROR] Wishlist check error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
