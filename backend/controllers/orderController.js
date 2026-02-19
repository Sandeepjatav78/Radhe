import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import razorpay from 'razorpay';
// ✅ IMPORT the detailed function from your utils file
import sendWhatsAppAdmin from "../utils/whatsapp.js"; 
import { incrementCouponUsage } from "./couponController.js"; 

// Global variables
const currency = 'inr';
const deliveryCharge = 10;

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Placing Order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, slot, prescriptionUrl, deliveryFee, couponCode, couponDiscount } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            deliveryFee: deliveryFee || 10,
            couponCode: couponCode || null,
            couponDiscount: couponDiscount || 0,
            slot: slot || "Standard Delivery",
            prescriptionUrl: prescriptionUrl || "", 
            prescriptionUploaded: !!prescriptionUrl, 
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Increment coupon usage if applied
        if (couponCode) {
            await incrementCouponUsage(couponCode);
        }

        // ✅ Use the DETAILED utility for COD
        await sendWhatsAppAdmin(newOrder);

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 2. Placing Order using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, slot, prescriptionUrl } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            slot: slot || "Standard Delivery",
            prescriptionUrl: prescriptionUrl || "", 
            prescriptionUploaded: !!prescriptionUrl, 
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { 
                    name: `${item.name} (${item.size || 'Unit'})` 
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 3. Placing Order using Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address, slot, prescriptionUrl } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            slot: slot || "Standard Delivery",
            prescriptionUrl: prescriptionUrl || "", 
            prescriptionUploaded: !!prescriptionUrl, 
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 4. Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            
            // ✅ Use the DETAILED utility after Stripe success
            await sendWhatsAppAdmin(order);

            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 5. Verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        
        if (orderInfo.status === 'paid') {
            const order = await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true }, { new: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            
            // ✅ Use the DETAILED utility after Razorpay success
            await sendWhatsAppAdmin(order);

            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const allorders = async (req, res) => {
    try {
        console.log('🔍 [DEBUG] /api/order/list called');
        console.log('🔍 [DEBUG] Headers:', req.headers);
        console.log('🔍 [DEBUG] Admin info:', req.admin);
        
        const orders = await orderModel.find({});
        console.log('🔍 [DEBUG] Found orders:', orders.length);
        
        res.json({ success: true, orders });
    } catch (error) {
        console.log('❌ [ERROR] allorders:', error);
        res.json({ success: false, message: error.message });
    }
};

const userorders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status, reason } = req.body;
        if (status === "Cancelled") {
            await orderModel.findByIdAndUpdate(orderId, { status: status, cancelReason: reason });
        } else {
            await orderModel.findByIdAndUpdate(orderId, { status: status });
        }
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    verifyRazorpay, 
    verifyStripe, 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allorders, 
    userorders, 
    updateStatus 
};