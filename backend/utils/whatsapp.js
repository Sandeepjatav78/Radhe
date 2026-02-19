import twilio from 'twilio';

const sendWhatsAppAdmin = async (orderData) => {
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const productList = orderData.items && orderData.items.length > 0 
            ? orderData.items.map(item => `• ${item.name} (x${item.quantity})`).join('\n')
            : "No items listed";

        const addr = orderData.address || {};
        const customerName = `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || "Customer";
        const contactNumber = addr.phone || "N/A";
        const fullAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''}, ${addr.zipcode || ''}`;

        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

        const messageBody = `🚨 *DETAILED ORDER ALERT* 🚨\n\n` +
            `🆔 *Order ID:* ${orderData._id}\n` +
            `💰 *Amount:* ₹${orderData.amount}\n` +
            `💳 *Payment:* ${orderData.paymentMethod}\n` +
            `⏰ *Slot:* ${orderData.slot}\n` +
            `---------------------------\n\n` +
            `🛍️ *PRODUCTS:* \n${productList}\n\n` +
            `👤 *CUSTOMER:* \n• Name: ${customerName}\n• Phone: ${contactNumber}\n\n` +
            `📍 *LOCATION:* \n${fullAddress}\n\n` +
            `🔗 *MAP LINK:* \n${mapUrl}`;

        await client.messages.create({
            from: 'whatsapp:+14155238886', 
            to: `whatsapp:${process.env.ADMIN_PHONE}`,
            body: messageBody
        });
        
        console.log("✅ Detailed WhatsApp sent successfully!");
    } catch (error) {
        console.error("❌ WhatsApp Error:", error.message);
    }
};

export default sendWhatsAppAdmin;