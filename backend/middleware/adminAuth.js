import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        console.log('🔍 [DEBUG] adminAuth middleware - Token received:', token ? 'YES' : 'NO');
        console.log('🔍 [DEBUG] adminAuth middleware - All headers:', req.headers);

        if (!token || token === "" || token === "null" || token === "undefined") {
            console.log('❌ [ERROR] No valid token provided');
            return res.status(401).json({ success: false, message: "No token provided, Login Again" });
        }

        // Verify and decode JWT token
        try {
            const token_decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ [DEBUG] Token decoded:', token_decode);
            
            // Check if decoded token has admin role and matches admin email
            if (token_decode.role !== 'admin' || token_decode.email !== process.env.ADMIN_EMAIL) {
                console.log('❌ [ERROR] Invalid role or email. Role:', token_decode.role, 'Email:', token_decode.email);
                return res.status(403).json({ success: false, message: "Not Authorized. Admin access required" });
            }
            
            // Add admin info to request
            req.admin = token_decode;
            console.log('✅ [DEBUG] Admin authorized:', token_decode.email);
            next();
        } catch (jwtErr) {
            console.log('❌ [ERROR] JWT verification failed:', jwtErr.message);
            return res.status(401).json({ success: false, message: "Session Expired or Invalid Token" });
        }
    } catch (error) {
        console.log('❌ [ERROR] adminAuth error:', error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export default adminAuth;