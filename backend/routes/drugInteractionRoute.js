import express from "express";
import { addDrugInteraction, checkInteractions, getAllInteractions } from "../controllers/drugInteractionController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const drugInteractionRouter = express.Router();

drugInteractionRouter.post("/check", checkInteractions);
drugInteractionRouter.post("/admin/add", auth, adminAuth, addDrugInteraction);
drugInteractionRouter.get("/admin/all", auth, adminAuth, getAllInteractions);

export default drugInteractionRouter;
