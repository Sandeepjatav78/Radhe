import express from "express";
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from "../controllers/couponController.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const couponRouter = express.Router();

// User routes
couponRouter.post("/validate", auth, validateCoupon);

// Admin routes
couponRouter.get("/list", adminAuth, getAllCoupons);
couponRouter.post("/create", adminAuth, createCoupon);
couponRouter.put("/update/:id", adminAuth, updateCoupon);
couponRouter.delete("/delete/:id", adminAuth, deleteCoupon);

export default couponRouter;
