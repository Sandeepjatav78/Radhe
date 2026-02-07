import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js"; // Check your file name (productModel vs productModels)
import categoryModel from "../models/categoryModel.js";

// 1. Add Product (With Auto-Category Creation)
const addProduct = async (req, res) => {
    try {
        const {
            name, description, category, subCategory,
            bestsellar, saltComposition, manufacturer,
            prescriptionRequired, variants
        } = req.body;

        // --- Handle Images ---
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // --- Parse Variants ---
        let parsedVariants = [];
        try {
            parsedVariants = JSON.parse(variants);
        } catch (error) {
            console.log("Variant Parsing Error", error);
            parsedVariants = [];
        }

        // --- Create Product Data ---
        const productData = {
            name,
            description,
            category,
            subCategory,
            bestsellar: bestsellar === "true",
            image: imagesUrl,
            saltComposition,
            manufacturer,
            prescriptionRequired: prescriptionRequired === "true",
            variants: parsedVariants,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();

        // --- 🔥 CRITICAL: AUTO-SAVE CATEGORY ---
        // If the category or subcategory is new, save it to the Category Collection
        if (category) {
            await categoryModel.findOneAndUpdate(
                { name: category }, // Find category by name
                { $addToSet: { subCategories: subCategory } }, // Add subCategory if it doesn't exist
                { upsert: true, new: true } // Create the category if it doesn't exist
            );
        }

        res.json({ success: true, message: "Medicine Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 2. List Categories
const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 3. List Products
const listProduct = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, sort } = req.query;

        // 1. Build Search Query
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" }; // Case insensitive search
        }

        // 2. Build Sort Option
        let sortOption = {};
        // "newest" means descending order (-1) of date
        if (sort === "newest") {
            sortOption = { date: -1 }; 
        } else {
            sortOption = { date: 1 }; // Oldest first
        }

        // 3. Fetch from DB
        const products = await productModel.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // 4. Get Total Count (for pagination)
        const count = await productModel.countDocuments(query);

        res.json({
            success: true,
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// 4. Remove Product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Medicine Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// 5. Single Product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            id, name, description, category, subCategory,
            bestsellar, saltComposition, manufacturer,
            prescriptionRequired, expiryDate, variants
        } = req.body;

        // 1. Fetch Existing Product to get current images
        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // 2. Handle Image Updates
        // We create a copy of the existing images array
        let updatedImages = [...product.image]; 

        // If user uploaded a new image1, upload it and replace index 0
        if (req.files.image1) {
            const result = await cloudinary.uploader.upload(req.files.image1[0].path, { resource_type: 'image' });
            updatedImages[0] = result.secure_url;
        }
        if (req.files.image2) {
            const result = await cloudinary.uploader.upload(req.files.image2[0].path, { resource_type: 'image' });
            updatedImages[1] = result.secure_url;
        }
        if (req.files.image3) {
            const result = await cloudinary.uploader.upload(req.files.image3[0].path, { resource_type: 'image' });
            updatedImages[2] = result.secure_url;
        }
        if (req.files.image4) {
            const result = await cloudinary.uploader.upload(req.files.image4[0].path, { resource_type: 'image' });
            updatedImages[3] = result.secure_url;
        }

        // Filter out undefined if array grew weirdly (safety check)
        updatedImages = updatedImages.filter(img => img);

        // 3. Handle Variants
        let parsedVariants = [];
        if (typeof variants === 'string') {
            try { parsedVariants = JSON.parse(variants); } catch (e) { parsedVariants = []; }
        } else {
            parsedVariants = variants;
        }

        // 4. Update Database
        await productModel.findByIdAndUpdate(id, {
            name,
            description,
            category,
            subCategory,
            image: updatedImages, // ✅ Save updated images
            bestsellar: bestsellar === "true" || bestsellar === true,
            saltComposition,
            manufacturer,
            prescriptionRequired: prescriptionRequired === "true" || prescriptionRequired === true,
            expiryDate: Number(expiryDate),
            variants: parsedVariants
        });

        // 5. Auto-Save Category (Same as Add Product)
        if (category) {
            await categoryModel.findOneAndUpdate(
                { name: category },
                { $addToSet: { subCategories: subCategory } },
                { upsert: true, new: true }
            );
        }

        res.json({ success: true, message: "Product Details & Images Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const seedCategories = async (req, res) => {
    try {
        // Aapka Puraana Hardcoded Data
        const defaultCategoryData = {
            "Tablet": ["Pain Relief", "Gastric", "Antibiotic", "Vitamins", "Cold & Cough", "Heart", "Other"],
            "Syrup": ["Cough Syrup", "Digestion", "Multivitamin", "Antacid", "Other"],
            "Injection": ["Pain Killer", "Antibiotic", "Diabetes", "Vaccine", "Other"],
            "Cream": ["Antifungal", "Antibiotic", "Pain Relief", "Moisturizer", "Skin Care", "Other"],
            "Drops": ["Eye Drops", "Ear Drops", "Pediatric Drops", "Other"],
            "Sexual Wellness": ["Condoms", "Lubricants", "Performance Supplements", "Test Kits", "Hygiene", "Other"],
            "Devices": ["BP Monitor", "Glucometer", "Thermometer", "Oximeter", "Other"],
            "Health & Nutrition": ["Daily Supplements", "Protein Supplements", "Weight Management", "Energy Drinks", "Multivitamins", "Other"],
            "Other": []
        };

        // Loop chalakar DB mein save karein
        for (const [catName, subCats] of Object.entries(defaultCategoryData)) {
            await categoryModel.findOneAndUpdate(
                { name: catName }, 
                { 
                    $addToSet: { subCategories: { $each: subCats } } // Duplicate nahi hone dega
                },
                { upsert: true, new: true } // Agar nahi hai to naya bana dega
            );
        }

        res.json({ success: true, message: "All Categories & Sub-Categories Added to DB Successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct, listCategories,seedCategories };