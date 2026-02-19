import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/Cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import couponRouter from './routes/couponRoute.js'
import prescriptionRouter from './routes/prescriptionRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import drugInteractionRouter from './routes/drugInteractionRoute.js'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dashboardRouter from './routes/dashboardRoute.js'
import adminRoutes from "./routes/adminRoutes.js";

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Custom NoSQL Injection Prevention Middleware (Express 5 compatible)
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                // Remove keys starting with $ or containing .
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            });
        }
        return obj;
    };
    
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    // Note: req.query is read-only in Express 5, so we skip it
    
    next();
};

// Security Middlewares
app.use(helmet()) // Security headers
app.use(sanitizeInput) // Prevent NoSQL injection (Express 5 compatible)

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: { success: false, message: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(express.json())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS Configuration - allow all in development, restrict in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : true, // Allow all origins in development
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

// API endpoint
app.use('/api/user/login', authLimiter); // Rate limit login
app.use('/api/user/register', authLimiter); // Rate limit register
app.use('/api/user/admin', authLimiter); // Rate limit admin login
app.use('/api/user', userRouter)
app.use('/api/product', apiLimiter, productRouter)
app.use('/api/cart', apiLimiter, cartRouter)
app.use('/api/order', apiLimiter, orderRouter)
app.use('/api/coupon', apiLimiter, couponRouter)
app.use('/api/prescription', apiLimiter, prescriptionRouter)
app.use('/api/review', apiLimiter, reviewRouter)
app.use('/api/drug-interaction', apiLimiter, drugInteractionRouter)
app.use('/api/dashboard', apiLimiter, dashboardRouter)

app.get('/', (req, res) => {
    res.send("API WORKING")
})

app.use("/api/admin", apiLimiter, adminRoutes);

app.listen(port, () => console.log('server started at port number:' + port))

