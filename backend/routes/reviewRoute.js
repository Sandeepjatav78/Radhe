import express from "express";
import { addReview, getProductReviews, updateReviewHelpful, getUserReviews } from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", auth, addReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.put("/helpful/:reviewId", updateReviewHelpful);
reviewRouter.get("/user", auth, getUserReviews);

export default reviewRouter;
