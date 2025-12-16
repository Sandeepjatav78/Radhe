import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js"; 

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name, description, price, mrp, category, subCategory, bestsellar,
      saltComposition, manufacturer, packSize, 
      batchNumber, // <--- 1. YAHAN RECEIVE KIYA
      stock, expiryDate, prescriptionRequired
    } = req.body;

    // Handling Images
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

    // Data Preparation
    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      mrp: Number(mrp),
      bestsellar: bestsellar === "true" ? true : false,
      image: imagesUrl,

      // Pharmacy Data Save
      saltComposition,
      manufacturer,
      packSize,
      batchNumber, // <--- 2. YAHAN DATABASE OBJECT ME DAALA
      stock: Number(stock),
      expiryDate: Number(expiryDate),
      prescriptionRequired: prescriptionRequired === "true" ? true : false,

      date: Date.now()
    }

    console.log(productData); 

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
      id, name, description, price, mrp, category, subCategory, bestsellar,
      saltComposition, manufacturer, packSize, 
      batchNumber, // <--- 3. UPDATE ME BHI RECEIVE KIYA
      stock, expiryDate, prescriptionRequired
    } = req.body;

    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      price: Number(price),
      mrp: Number(mrp),
      category,
      subCategory,
      bestsellar: bestsellar === "true" || bestsellar === true,
      
      saltComposition,
      manufacturer,
      packSize,
      batchNumber, // <--- 4. UPDATE QUERY ME ADD KIYA
      stock: Number(stock),
      expiryDate: Number(expiryDate),
      prescriptionRequired: prescriptionRequired === "true" || prescriptionRequired === true
    });

    res.json({ success: true, message: "Product Details Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Export it
export { listProduct, addProduct, removeProduct, singleProduct, updateProduct };