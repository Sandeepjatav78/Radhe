import { generateOTP, sendSmsOTP as sendMsg91OTP } from "./msg91Service.js";
import { sendWhatsAppOTP, sendSmsOTP as sendTwilioSmsOTP, getOTPExpiry, isOTPValid } from "./otpService.js";
import { sendWhatsAppCloudOTP } from "./whatsappOtpService.js";

// Unified OTP sender:
// 1. WhatsApp Cloud API (Meta) - free OTPs inside service windows, ~₹0.115 otherwise
// 2. MSG91 (India, no template needed) if MSG91_AUTH_KEY is configured
// 3. Twilio WhatsApp/SMS as fallback
// 4. DEBUG_MODE prints OTP to console instead of sending

export const generateOtp = generateOTP;

export const getOtpExpiry = getOTPExpiry;

export const verifyOtp = isOTPValid;

export const sendOtp = async (phoneNumber, otp) => {
    const preferWhatsApp = process.env.OTP_CHANNEL === 'whatsapp';

    if (process.env.DEBUG_MODE === 'true') {
        return sendTwilioSmsOTP(phoneNumber, otp);
    }

    // 1. WhatsApp Cloud API (Meta) - used when OTP_CHANNEL=whatsapp OR token configured
    if (preferWhatsApp || process.env.WHATSAPP_TOKEN) {
        const waSent = await sendWhatsAppCloudOTP(phoneNumber, otp);
        if (waSent) return true;
        console.error('⚠️ WhatsApp Cloud API failed, trying SMS fallback...');
    }

    // 2. MSG91 (if configured)
    if (process.env.MSG91_AUTH_KEY) {
        const msg91Sent = await sendMsg91OTP(phoneNumber, otp);
        if (msg91Sent) return true;
        console.error('⚠️ MSG91 failed, falling back to Twilio SMS...');
    }

    // 3. Twilio WhatsApp/SMS as last resort
    if (preferWhatsApp) {
        const waSent = await sendWhatsAppOTP(phoneNumber, otp);
        if (waSent) return true;
    }

    return await sendTwilioSmsOTP(phoneNumber, otp);
};