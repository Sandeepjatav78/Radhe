import crypto from 'crypto';

// GET /webhook - Meta webhook verification (returns hub.challenge as plain text)
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully');
        return res.status(200).type('text/plain').send(challenge);
    }

    console.warn('❌ Webhook verification failed:', { mode, token });
    return res.status(403).send('Verification failed');
};

// POST /webhook - receive incoming WhatsApp events (messages & status updates)
const handleWebhook = (req, res) => {
    try {
        // Verify request signature (if app secret is configured)
        const signature = req.headers['x-hub-signature-256'];
        const appSecret = process.env.WHATSAPP_APP_SECRET;

        if (appSecret && signature) {
            const expected = 'sha256=' + crypto
                .createHmac('sha256', appSecret)
                .update(req.rawBody || '')
                .digest('hex');
            if (signature !== expected) {
                console.warn('❌ Invalid webhook signature');
                return res.status(403).send('Invalid signature');
            }
        }

        const body = req.body || {};
        for (const entry of body.entry || []) {
            for (const change of entry.changes || []) {
                const value = change.value || {};

                if (change.field === 'messages') {
                    // Delivery status updates (sent/delivered/read/failed)
                    for (const status of value.statuses || []) {
                        console.log(`📬 WhatsApp message ${status.id} status: ${status.status}`);
                        if (status.status === 'failed') {
                            console.error('   ❌ Delivery failed:', JSON.stringify(status.errors || {}));
                        }
                    }
                    // Incoming messages from users (e.g. "hello")
                    for (const msg of value.messages || []) {
                        console.log(`💬 Incoming WhatsApp message from ${msg.from}: ${msg.text?.body || '[non-text]'}`);
                    }
                }
            }
        }

        // Always ack with 200 so Meta doesn't retry
        return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error('❌ Webhook handler error:', error);
        return res.status(200).send('EVENT_RECEIVED');
    }
};

export { verifyWebhook, handleWebhook };