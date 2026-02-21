const FAQS = [
	{
		title: "Track my order",
		sample: "Where is my order?",
		keywords: ["order", "track", "tracking", "status", "where is my order"],
		reply: "To track your order, go to Orders in your account. If you are not logged in, please log in first."
	},
	{
		title: "Login or signup",
		sample: "How do I sign in?",
		keywords: ["login", "sign in", "account", "register", "signup"],
		reply: "You can sign in or create an account from the Login/Signup page. If you forgot your password, use the reset option there."
	},
	{
		title: "Change address",
		sample: "How can I update my address?",
		keywords: ["address", "change address", "update address", "location"],
		reply: "You can update your delivery address during checkout or in your profile."
	},
	{
		title: "Delivery time",
		sample: "When will it arrive?",
		keywords: ["delivery", "shipping", "ship", "when will it arrive"],
		reply: "Delivery time depends on your location. You can see delivery details at checkout and in your Orders page."
	},
	{
		title: "Cancel or refund",
		sample: "How do I cancel?",
		keywords: ["return", "refund", "cancel", "cancellation"],
		reply: "You can request a cancellation or refund from your Orders page. If the option is not available, please contact support."
	},
	{
		title: "Replacement",
		sample: "I got a wrong item",
		keywords: ["exchange", "replace", "replacement"],
		reply: "If an item is damaged or incorrect, contact support from your Orders page and we will help with a replacement."
	},
	{
		title: "Get invoice",
		sample: "How do I download the bill?",
		keywords: ["invoice", "bill", "receipt"],
		reply: "Your invoice is available in the order details page once the order is confirmed."
	},
	{
		title: "Apply coupon",
		sample: "Coupon not working",
		keywords: ["coupon", "discount", "promo", "code"],
		reply: "Apply coupon codes at checkout. If a code is not working, please check its minimum order value and validity."
	},
	{
		title: "Payment help",
		sample: "Payment failed",
		keywords: ["payment", "pay", "razorpay", "stripe", "card", "upi"],
		reply: "We support multiple payment options. If a payment fails, please try again or use another method."
	},
	{
		title: "Cash on delivery",
		sample: "Is COD available?",
		keywords: ["cod", "cash on delivery"],
		reply: "Cash on delivery availability depends on your location and order value. Please check during checkout."
	},
	{
		title: "Prescription upload",
		sample: "How to upload prescription?",
		keywords: ["prescription", "rx", "upload"],
		reply: "Some medicines require a prescription. You can upload it during checkout or from your profile."
	},
	{
		title: "Expiry date",
		sample: "Item close to expiry",
		keywords: ["expiry", "expire", "exp date", "batch"],
		reply: "We supply products within valid shelf life. If you receive an item close to expiry, contact support with your order ID."
	},
	{
		title: "Stock availability",
		sample: "Out of stock",
		keywords: ["availability", "in stock", "stock", "out of stock"],
		reply: "Product availability is shown on the product page. If an item is out of stock, please check again later."
	},
	{
		title: "Dosage guidance",
		sample: "How much should I take?",
		keywords: ["dosage", "dose", "how to take", "side effects", "interaction"],
		reply: "For dosage or side effects, please follow the label or consult a licensed healthcare professional."
	},
	{
		title: "Wellness tips",
		sample: "Any general health tips?",
		keywords: ["health", "wellness", "tips", "diet", "exercise", "sleep"],
		reply: "General wellness tips: stay hydrated, eat a balanced diet, exercise regularly, and prioritize sleep. For personalized advice, consult a healthcare professional."
	}
];

const getAdminContact = () => {
	const email = process.env.ADMIN_EMAIL || "";
	const phone = process.env.ADMIN_PHONE || "";
	const parts = [];
	if (email) parts.push(`email ${email}`);
	if (phone) parts.push(`phone ${phone}`);
	if (parts.length === 0) return "Please contact support.";
	return `Please contact admin via ${parts.join(" or ")}.`;
};

const matchFaq = (text) => {
	const input = text.toLowerCase();
	return FAQS.find((faq) => faq.keywords.some((kw) => input.includes(kw)));
};

export const getChatbotFaqs = (req, res) => {
	const faqs = FAQS.map((faq) => ({
		title: faq.title,
		sample: faq.sample,
		tags: faq.keywords.slice(0, 3)
	}));
	return res.json({ success: true, faqs });
};

export const askChatbot = async (req, res) => {
	try {
		const { message } = req.body || {};

		if (!message || typeof message !== "string") {
			return res.status(400).json({ success: false, message: "Message is required" });
		}

		const faq = matchFaq(message);
		if (faq) {
			return res.json({ success: true, reply: faq.reply, source: "faq" });
		}

		const fallback = `I can help with orders, delivery, payments, prescriptions, and general wellness tips. ${getAdminContact()}`;
		return res.json({ success: true, reply: fallback, source: "fallback" });
	} catch (error) {
		console.error("[Chatbot] Error:", error);
		const fallback = `I can help with orders, delivery, payments, prescriptions, and general wellness tips. ${getAdminContact()}`;
		return res.json({ success: true, reply: fallback, source: "fallback" });
	}
};
