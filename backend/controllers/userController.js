import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp, getOtpExpiry, sendOtp } from "../utils/sendOtp.js";

const OTP_SALT = process.env.OTP_HASH_SECRET || 'radhe-otp-salt';

const hashOtp = (otp, phoneNumber) => {
    return crypto.createHash('sha256').update(`${otp}${phoneNumber}${OTP_SALT}`).digest('hex');
};

// Normalize an Indian phone number to E.164 format (+91XXXXXXXXXX)
const normalizePhone = (phone) => {
    if (!phone) return null;
    let p = String(phone).replace(/[\s\-()]/g, '');
    if (p.startsWith('00')) p = '+' + p.substring(2);
    if (p.startsWith('+')) {
        return p.length === 13 && p.startsWith('+91') ? p : null;
    }
    if (p.startsWith('91') && p.length === 12) return '+91' + p.substring(2);
    if (p.startsWith('0') && p.length === 11) return '+91' + p.substring(1);
    if (/^\d{10}$/.test(p)) return '+91' + p;
    return null;
};

// 1. Send OTP to phone
const sendOtpCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const phone = normalizePhone(phoneNumber);

        if (!phone) {
            return res.status(400).json({ success: false, message: "Please enter a valid 10-digit phone number" });
        }

        // Cooldown: prevent sending multiple OTPs within 60 seconds
        const existing = await otpModel.findOne({ phoneNumber: phone });
        if (existing && existing.expiresAt && new Date() < new Date(existing.expiresAt)) {
            const secondsLeft = Math.ceil((new Date(existing.expiresAt) - new Date()) / 1000);
            return res.status(429).json({ 
                success: false, 
                message: `Please wait ${secondsLeft} seconds before requesting a new OTP`,
                cooldown: secondsLeft
            });
        }

        const otp = generateOtp();
        const otpHash = hashOtp(otp, phone);

        await otpModel.findOneAndUpdate(
            { phoneNumber: phone },
            { phoneNumber: phone, otpHash, expiresAt: getOtpExpiry(), attempts: 0 },
            { upsert: true, new: true }
        );

        const sent = await sendOtp(phone, otp);
        if (!sent) {
            return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
        }

        // In debug mode, return the OTP so it can be seen in dev without an SMS gateway
        res.json({
            success: true,
            message: "OTP sent successfully",
            debugOtp: process.env.DEBUG_MODE === 'true' ? otp : undefined,
            expiresIn: 600
        });
    } catch (error) {
        console.error('sendOtp Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 2. Verify OTP and issue JWT (auto-creates user on first login)
const verifyOtpCode = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const phone = normalizePhone(phoneNumber);

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
        }

        if (!/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
        }

        const otpDoc = await otpModel.findOne({ phoneNumber: phone });

        if (!otpDoc) {
            return res.status(400).json({ success: false, message: "No OTP found. Please request a new OTP." });
        }

        if (otpDoc.attempts >= 5) {
            await otpModel.deleteOne({ phoneNumber: phone });
            return res.status(429).json({ success: false, message: "Too many attempts. Please request a new OTP." });
        }

        if (new Date() > new Date(otpDoc.expiresAt)) {
            await otpModel.deleteOne({ phoneNumber: phone });
            return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP." });
        }

        const enteredHash = hashOtp(String(otp).trim(), phone);
        if (enteredHash !== otpDoc.otpHash) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
        }

        // OTP verified - create/find the user by phone
        let user = await userModel.findOne({ phoneNumber: phone });
        if (!user) {
            user = new userModel({ phoneNumber: phone, isVerified: true });
            await user.save();
        }

        // OTP is single-use
        await otpModel.deleteOne({ phoneNumber: phone });

        const token = jwt.sign(
            { id: user._id.toString(), phoneNumber: phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('verifyOtp Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get user profile (authenticated via JWT)
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
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
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const { name, address, phoneNumber } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (phoneNumber) {
            const phone = normalizePhone(phoneNumber);
            if (!phone) return res.status(400).json({ success: false, message: "Invalid phone number" });
            updateData.phoneNumber = phone;
        }

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated",
            user: {
                id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.name,
                address: user.address
            }
        });
    } catch (error) {
        console.error('updateProfile Error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin login (email/password from env, issues JWT)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export { sendOtpCode, verifyOtpCode, getProfile, updateProfile, adminLogin };
