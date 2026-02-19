import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            console.log(`[AUTH] No token provided for ${req.method} ${req.path}`);
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        try {
            const token_decode = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user ID to request body and create user object
            req.body.userId = token_decode.id;
            req.user = { id: token_decode.id };
            
            console.log(`[AUTH] ✅ Authorized for user ${token_decode.id} - ${req.method} ${req.path}`);
            next();
        } catch (jwtError) {
            console.log(`[AUTH] ❌ JWT verification failed: ${jwtError.message}`);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

    } catch (error) {
        console.error(`[AUTH] Server error:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default authUser;