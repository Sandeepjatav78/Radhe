import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subCategories: { type: [String], default: [] } // Array of Strings
}, { minimize: false })

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;