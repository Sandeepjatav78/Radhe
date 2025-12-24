import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js";

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      bestsellar,
      saltComposition,
      manufacturer,
      prescriptionRequired,
      variants // <--- Main Data yahan hai ab
    } = req.body;

    // --- 1. Handling Images ---
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

    // --- 2. Parse Variants ---
    let parsedVariants = [];
    try {
        parsedVariants = JSON.parse(variants); 
    } catch (error) {
        console.log("Variant Parsing Error", error);
        parsedVariants = [];
    }

    // --- 3. Data Preparation ---
    // Note: Maine yahan se price, mrp, stock, expiryDate hata diye hain
    // Kyunki wo ab 'variants' array ke andar hain.
    
    const productData = {
      name,
      description,
      category,
      subCategory,
      bestsellar: bestsellar === "true" ? true : false,
      image: imagesUrl,
      
      // Pharmacy Data
      saltComposition,
      manufacturer,
      prescriptionRequired: prescriptionRequired === "true" ? true : false,

      // Variants Data (Isme Price, Stock, MRP, Batch sab hai)
      variants: parsedVariants, 

      date: Date.now()
    }

    console.log(productData); // Ab NaN nahi dikhega

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Medicine Added Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// List All Products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Medicine Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single Product Info
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
// Update Product (Full Edit)
const updateProduct = async (req, res) => {
  try {
    const {
      id, 
      name, 
      description, 
      category, 
      subCategory, 
      bestsellar,
      saltComposition, 
      manufacturer, 
      prescriptionRequired,
      expiryDate,
      variants // <--- 1. IMPORTANT: Variants receive karein
    } = req.body;

    // --- 2. Handle Variants Data ---
    // Frontend (Update.jsx) JSON bhej raha hai, to ye direct Array ho sakta hai.
    // Lekin safety ke liye check kar rahe hain.
    let parsedVariants = [];
    
    if (typeof variants === 'string') {
        try {
            parsedVariants = JSON.parse(variants);
        } catch (e) {
            parsedVariants = [];
        }
    } else {
        parsedVariants = variants; // Agar direct Array aaya to waisa hi le lo
    }

    // --- 3. Update Query ---
    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      category,
      subCategory,
      bestsellar: bestsellar === "true" || bestsellar === true,
      
      saltComposition,
      manufacturer,
      prescriptionRequired: prescriptionRequired === "true" || prescriptionRequired === true,
      expiryDate: Number(expiryDate),

      // Price/Stock fields hata diye, sirf variants update honge
      variants: parsedVariants 
    });

    res.json({ success: true, message: "Product Details Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Export it
export { listProduct, addProduct, removeProduct, singleProduct, updateProduct };