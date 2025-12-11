import userModel from "../models/userModel.js"

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const userData = await userModel.findById(userId);
        
        // --- SAFETY CHECK START ---
        if (!userData) {
            return res.json({ success: false, message: "User not found. Please login again." });
        }
        // --- SAFETY CHECK END ---

        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// Update Cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        
        const userData = await userModel.findById(userId);

        // --- SAFETY CHECK ---
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = await userData.cartData;

        cartData[itemId] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);

        // --- SAFETY CHECK (Yehi line error de rahi thi) ---
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = await userData.cartData;

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }