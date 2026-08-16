import axios from 'axios';

const GRAPH_API_URL = 'https://graph.facebook.com';
const GRAPH_API_VERSION = 'v21.0';

// Send OTP via Meta WhatsApp Cloud API (authentication template)
export const sendWhatsAppCloudOTP = async (phoneNumber, otp) => {
    try {
        if (process.env.DEBUG_MODE === 'true') {
            console.log('\n' + '='.repeat(60));
            console.log('🔧 DEBUG MODE - WhatsApp Cloud OTP (Not Sent)');
            console.log('='.repeat(60));
            console.log(`📱 Phone: ${phoneNumber}`);
            console.log(`🔐 OTP: ${otp}`);
            console.log(`⏱️  Valid: 10 minutes`);
            console.log('='.repeat(60) + '\n');
            return true;
        }

        const token = process.env.WHATSAPP_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const templateName = process.env.WHATSAPP_OTP_TEMPLATE || 'radhe_otp';

        if (!token || !phoneNumberId) {
            console.error('❌ WhatsApp Cloud API not configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env');
            return false;
        }

        // WhatsApp numbers use country code without '+'
        const to = phoneNumber.replace('+', '');

        const url = `${GRAPH_API_URL}/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [{ type: 'text', text: otp }]
                    }
                ]
            }
        };

        console.log(`📤 Sending WhatsApp OTP to ${phoneNumber} (template: ${templateName})...`);

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data?.messages?.[0]?.id) {
            console.log(`✅ WhatsApp OTP sent to ${phoneNumber} (msg id: ${response.data.messages[0].id})`);
            return true;
        }

        console.error('❌ WhatsApp unexpected response:', JSON.stringify(response.data));
        return false;
    } catch (error) {
        console.error('❌ WhatsApp Cloud API Error:', error.message);
        console.error('   Status:', error.response?.status);
        console.error('   Data:', JSON.stringify(error.response?.data, null, 2));
        return false;
    }
};