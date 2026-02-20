import userModel from "../models/userModel.js"

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const clerkId = req.user?.id;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        console.log(`[CART] Adding item ${itemId} for user ${clerkId}`);

        const userData = await userModel.findOne({ clerkId });
        
        if (!userData) {
            console.log(`[CART] ❌ User not found: ${clerkId}`);
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        // Logic to add nested size
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        userData.markModified('cartData'); 
        await userData.save();

        console.log(`[CART] ✅ Item added for user ${clerkId}`);
        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.error('[CART] Error adding to cart:', error);
        res.json({ success: false, message: error.message })
    }
}

// Update Cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const clerkId = req.user?.id;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        console.log(`[CART] Updating item ${itemId} for user ${clerkId}`);
        
        const userData = await userModel.findOne({ clerkId });

        if (!userData) {
            console.log(`[CART] ❌ User not found: ${clerkId}`);
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        // Ensure item object exists
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;

        userData.markModified('cartData');
        await userData.save();
        
        console.log(`[CART] ✅ Cart updated for user ${clerkId}`);
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.error('[CART] Error updating cart:', error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Cart
const getUserCart = async (req, res) => {
    try {
        const clerkId = req.user?.id;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        console.log(`[CART] Getting cart for user ${clerkId}`);

        const userData = await userModel.findOne({ clerkId });

        if (!userData) {
            console.log(`[CART] ❌ User not found: ${clerkId}`);
            return res.json({ success: true, cartData: {} });
        }

        let cartData = userData.cartData || {};

        console.log(`[CART] ✅ Cart retrieved for user ${clerkId}`);
        res.json({ success: true, cartData });
    } catch (error) {
        console.error('[CART] Error getting cart:', error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }