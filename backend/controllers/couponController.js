import couponModel from "../models/couponModel.js";

// Validate Coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.json({ success: false, message: "Coupon code required" });
    }

    const coupon = await couponModel.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid coupon code" });
    }

    // Check expiry
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.json({ success: false, message: "Coupon has expired" });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Coupon usage limit reached" });
    }

    // Check minimum order
    if (cartTotal < coupon.minOrder) {
      return res.json({ 
        success: false, 
        message: `Minimum order of ₹${coupon.minOrder} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.round((cartTotal * coupon.value) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === "flat") {
      discount = coupon.value;
    } else if (coupon.type === "delivery") {
      discount = coupon.value; // Will be applied to delivery fee
    }

    res.json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: discount
      }
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Coupons (Admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Create Coupon (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code, type, value, minOrder, maxDiscount, expiryDate, usageLimit } = req.body;

    // Check if coupon exists
    const exists = await couponModel.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = new couponModel({
      code: code.toUpperCase(),
      type,
      value,
      minOrder: minOrder || 0,
      maxDiscount: maxDiscount || null,
      expiryDate: expiryDate || null,
      usageLimit: usageLimit || null
    });

    await coupon.save();
    res.json({ success: true, message: "Coupon created successfully", coupon });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Coupon (Admin)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const coupon = await couponModel.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon updated successfully", coupon });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await couponModel.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Increment usage count when order is placed
const incrementCouponUsage = async (couponCode) => {
  try {
    if (!couponCode) return;
    
    await couponModel.findOneAndUpdate(
      { code: couponCode.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  } catch (error) {
    console.error("Error incrementing coupon usage:", error);
  }
};

export {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage
};
