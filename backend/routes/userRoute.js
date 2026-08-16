import express from 'express'
import { sendOtpCode, verifyOtpCode, getProfile, updateProfile, adminLogin } from '../controllers/userController.js'
import auth from "../middleware/auth.js";

const userRouter = express.Router();

// OTP authentication routes
userRouter.post('/send-otp', sendOtpCode);
userRouter.post('/verify-otp', verifyOtpCode);

// Profile routes (JWT authentication)
userRouter.get('/profile', auth, getProfile);
userRouter.post('/update-profile', auth, updateProfile);

// Admin login
userRouter.post('/admin', adminLogin);

export default userRouter;
