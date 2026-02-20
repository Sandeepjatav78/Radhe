import twilio from 'twilio';

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp
export const sendWhatsAppOTP = async (phoneNumber, otp) => {
    try {
        if (process.env.DEBUG_MODE === 'true') {
            console.log('\n' + '='.repeat(60));
            console.log('🔧 DEBUG MODE - WhatsApp OTP (Not Sent)');
            console.log('='.repeat(60));
            console.log(`📱 Phone: ${phoneNumber}`);
            console.log(`🔐 OTP: ${otp}`);
            console.log(`⏱️  Valid: 10 minutes`);
            console.log('='.repeat(60) + '\n');
            return true;
        }

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        await client.messages.create({
            body: `🔐 Your Radhe Pharmacy OTP: ${otp}\nValid for 10 minutes. Do not share!`,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${phoneNumber}`
        });

        console.log(`✅ WhatsApp OTP sent to ${phoneNumber}`);
        return true;
    } catch (error) {
        console.error('❌ WhatsApp Error:', error.message);
        return false;
    }
};

// Send OTP via SMS
export const sendSmsOTP = async (phoneNumber, otp) => {
    try {
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

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        console.log(`📤 Attempting to send SMS to ${phoneNumber} from ${process.env.TWILIO_PHONE_NUMBER}`);
        
        await client.messages.create({
            body: `Your Radhe Pharmacy OTP: ${otp} (Valid for 10 minutes)`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log(`✅ SMS OTP sent to ${phoneNumber}`);
        return true;
    } catch (error) {
        console.error('❌ SMS Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('More Info:', error.moreInfo);
        
        if (error.code === 21606) {
            console.error('⚠️  The "From" number is not SMS-capable. You need to purchase an SMS-enabled number from Twilio.');
        }
        
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

    if (new Date() > expiryTime) {
        return { valid: false, message: "OTP expired. Request a new one." };
    }

    if (storedOTP !== enteredOTP) {
        return { valid: false, message: "Incorrect OTP" };
    }

    return { valid: true, message: "OTP verified" };
};
