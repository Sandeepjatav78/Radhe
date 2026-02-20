import express from 'express'
import { getProfile, updateProfile } from '../controllers/userController.js'
import auth from "../middleware/auth.js";

const userRouter = express.Router();

// Profile routes (Clerk authentication)
userRouter.get('/profile', auth, getProfile);
userRouter.post('/update-profile', auth, updateProfile);

export default userRouter;