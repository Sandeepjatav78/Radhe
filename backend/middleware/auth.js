import { verifyToken } from '@clerk/clerk-sdk-node';

const authUser = async (req, res, next) => {
    try {
        // Get the token from the Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            // Verify the Clerk token using clerk-sdk-node
            const decoded = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
                authorizedParties: [
                    'http://localhost:5173',
                    'http://localhost:5174',
                    'http://localhost:3000',
                    'https://www.radhepharmacy.app',
                    'https://radhepharmacy.app'
                ]
            });
            
            // Add Clerk user ID to request object
            req.user = { 
                id: decoded.sub,  // Clerk user ID
                email: decoded.email || '',
                phoneNumber: decoded.phone_numbers?.[0]?.phone_number || ''
            };
            next();
        } catch (tokenError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token. Please login again.' 
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default authUser;