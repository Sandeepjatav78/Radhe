import mongoose from "mongoose";

const drugInteractionSchema = new mongoose.Schema({
    drug1: { type: String, required: true }, // Medicine name or ID
    drug2: { type: String, required: true }, // Medicine name or ID
    severity: { 
        type: String, 
        enum: ["low", "moderate", "severe"], 
        required: true 
    },
    description: { type: String, required: true },
    recommendation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate interactions
drugInteractionSchema.index({ drug1: 1, drug2: 1 }, { unique: true });

const drugInteractionModel = mongoose.models.drug_interaction || mongoose.model("drug_interaction", drugInteractionSchema);
export default drugInteractionModel;
