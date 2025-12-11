import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js";

// Add Product (Pharmacy Logic)
const addProduct = async (req, res) => {
  try {
    // 1. Naye Pharmacy Fields receive karna
    const { 
        name, 
        description, 
        price, 
        category, 
        subCategory, 
        bestsellar, 
        
        // New Fields
        saltComposition,
        manufacturer,
        packSize,
        prescriptionRequired,
        stock,
        expiryDate
    } = req.body;

    // 2. Images handle karna (Same as before)
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesURL = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // 3. Data Prepare karna
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestsellar: bestsellar === "true" || bestsellar === true,
      image: imagesURL,
      date: Date.now(),
      
      // Saving New Fields
      saltComposition,
      manufacturer,
      packSize,
      stock: Number(stock),
      expiryDate: Number(expiryDate), // Timestamp format expected
      prescriptionRequired: prescriptionRequired === "true" || prescriptionRequired === true
    };

    console.log(productData); // Debugging ke liye

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Medicine Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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

export { listProduct, addProduct, removeProduct, singleProduct };