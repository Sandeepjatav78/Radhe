import prescriptionModel from "../models/prescriptionModel.js";
import orderModel from "../models/orderModel.js";

// Upload prescription image
export const uploadPrescription = async (req, res) => {
    try {
        const { orderId, prescriptionImage } = req.body;
        const userId = req.user.id;

        if (!orderId || !prescriptionImage) {
            return res.status(400).json({ success: false, message: "Order ID and prescription image required" });
        }

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order || order.userId !== userId) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Create prescription
        const prescription = new prescriptionModel({
            userId,
            orderId,
            prescriptionImage,
            status: "pending"
        });

        await prescription.save();

        // Update order with prescription URL
        order.prescriptionUrl = prescriptionImage;
        await order.save();

        res.json({ success: true, message: "Prescription uploaded successfully", prescription });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's prescriptions
export const getUserPrescriptions = async (req, res) => {
    try {
        const userId = req.user.id;
        const prescriptions = await prescriptionModel.find({ userId }).sort({ uploadedAt: -1 });
        res.json({ success: true, prescriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get all pending prescriptions
export const getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prescriptionModel
            .find({ status: "pending" })
            .sort({ uploadedAt: 1 });
        res.json({ success: true, prescriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Verify prescription
export const verifyPrescription = async (req, res) => {
    try {
        const { prescriptionId, status, rejectionReason, pharmacistNotes } = req.body;
        const adminId = req.user.id;

        if (!prescriptionId || !status) {
            return res.status(400).json({ success: false, message: "Prescription ID and status required" });
        }

        const prescription = await prescriptionModel.findByIdAndUpdate(
            prescriptionId,
            {
                status,
                verifiedAt: new Date(),
                verifiedBy: adminId,
                rejectionReason: rejectionReason || "",
                pharmacistNotes: pharmacistNotes || ""
            },
            { new: true }
        );

        res.json({ success: true, message: `Prescription ${status}`, prescription });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
