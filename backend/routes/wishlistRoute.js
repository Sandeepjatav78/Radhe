import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } from "../controllers/wishlistController.js";
import auth from "../middleware/auth.js";

const wishlistRouter = express.Router();

// More specific routes should come BEFORE general routes
wishlistRouter.get("/check/:productId", auth, isInWishlist);
wishlistRouter.post("/add", auth, addToWishlist);
wishlistRouter.post("/remove", auth, removeFromWishlist);
wishlistRouter.get("/", auth, getWishlist);

export default wishlistRouter;
