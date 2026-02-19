import express from "express";
import { uploadPrescription, getUserPrescriptions, getPendingPrescriptions, verifyPrescription } from "../controllers/prescriptionController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/upload", auth, uploadPrescription);
prescriptionRouter.get("/user", auth, getUserPrescriptions);
prescriptionRouter.get("/admin/pending", auth, adminAuth, getPendingPrescriptions);
prescriptionRouter.put("/admin/verify/:prescriptionId", auth, adminAuth, verifyPrescription);

export default prescriptionRouter;
