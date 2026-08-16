import axios from 'axios';

// MSG91 API Configuration
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via MSG91 Direct OTP API
export const sendSmsOTP = async (phoneNumber, otp) => {
    try {
        // Debug mode - print OTP in console instead of sending
        if (process.env.DEBUG_MODE === 'true') {
            console.log('\n' + '='.repeat(60));
            console.log('🔧 DEBUG MODE - SMS OTP (Not Sent)');
            console.log('='.repeat(60));
            console.log(`📱 Phone: ${phoneNumber}`);
            console.log(`🔐 OTP: ${otp}`);
            console.log(`⏱️  Valid: 10 minutes`);
            console.log('='.repeat(60) + '\n');
            return true;
        }

        // Check if MSG91 is configured
        if (!MSG91_AUTH_KEY) {
            console.error('❌ MSG91_AUTH_KEY not configured in .env');
            return false;
        }

        // Remove country code for Indian numbers (MSG91 format)
        let mobile = phoneNumber;
        if (phoneNumber.startsWith('+91')) {
            mobile = phoneNumber.substring(3);
        } else if (phoneNumber.startsWith('91')) {
            mobile = phoneNumber.substring(2);
        } else if (phoneNumber.startsWith('+')) {
            mobile = phoneNumber.substring(1);
        }

        // MSG91 Send OTP API
        const url = `https://api.msg91.com/api/v5/otp?otp=${otp}&mobile=91${mobile}${MSG91_TEMPLATE_ID ? `&template_id=${MSG91_TEMPLATE_ID}` : ''}`;

        console.log(`📤 Sending OTP to 91${mobile} via MSG91...`);

        const response = await axios.get(url, {
            headers: {
                'authkey': MSG91_AUTH_KEY
            }
        });

        // Log full MSG91 response for debugging
        console.log('📋 MSG91 Response:', JSON.stringify(response.data, null, 2));

        if (response.data.type === 'success') {
            console.log(`✅ SMS OTP sent successfully to ${phoneNumber}`);
            return true;
        } else {
            console.error('❌ MSG91 Error:', response.data.message || JSON.stringify(response.data));
            console.error('   Error Type:', response.data.type);
            return false;
        }
    } catch (error) {
        console.error('❌ MSG91 API Error:', error.message);
        console.error('   Status:', error.response?.status);
        console.error('   Data:', error.response?.data);
        return false;
    }
};

// Get OTP expiry time (10 minutes)
export const getOTPExpiry = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    return now;
};

// Check if OTP is valid
export const isOTPValid = (storedOTP, enteredOTP, expiryTime) => {
    if (!storedOTP || !enteredOTP) {
        return { valid: false, message: "OTP is missing" };
    }

    if (storedOTP !== enteredOTP) {
        return { valid: false, message: "Invalid OTP" };
    }

    if (new Date() > new Date(expiryTime)) {
        return { valid: false, message: "OTP has expired" };
    }

    return { valid: true, message: "OTP is valid" };
};