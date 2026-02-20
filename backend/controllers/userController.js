import userModel from "../models/userModel.js";

// Sync Clerk user with MongoDB (called on first login via /profile endpoint)
const syncClerkUser = async (clerkUserId, email, phoneNumber) => {
    try {
        // Build update object - only include phoneNumber if it has a value
        const updateData = {
            clerkId: clerkUserId,
            email: email || '',
            isVerified: true
        };
        
        // Only add phoneNumber if it exists and is not empty
        if (phoneNumber && phoneNumber.trim()) {
            updateData.phoneNumber = phoneNumber;
        }
        
        // Check if user exists in MongoDB by clerkId
        let user = await userModel.findOneAndUpdate(
            { clerkId: clerkUserId },
            updateData,
            { 
                upsert: true,  // Create if doesn't exist
                new: true      // Return updated document
            }
        );

        if (user) {
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Get user profile (with Clerk sync on first access)
const getProfile = async (req, res) => {
    try {
        const clerkUserId = req.user?.id;
        const email = req.user?.email;
        const phoneNumber = req.user?.phoneNumber;

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Sync user from Clerk on first profile access
        const user = await syncClerkUser(clerkUserId, email, phoneNumber);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            user: {
                id: user._id,
                clerkId: user.clerkId,
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.name,
                address: user.address,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const clerkUserId = req.user?.id;
        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const { name, address, phoneNumber } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        // Find user by Clerk ID and update
        const user = await userModel.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(user._id, updateData, { new: true });

        res.json({ 
            success: true, 
            message: "Profile updated",
            user: {
                id: updatedUser._id,
                clerkId: updatedUser.clerkId,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                name: updatedUser.name,
                address: updatedUser.address
            }
        });
    } catch (error) {
        console.error('updateProfile Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { getProfile, updateProfile, syncClerkUser };
