import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
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
