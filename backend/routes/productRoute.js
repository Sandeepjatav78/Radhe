import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct, updateProduct,seedCategories, listCategories } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js'

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.get('/list', listProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/categories', listCategories);
productRouter.get('/seed-categories', seedCategories);

// ✅ CHANGE: Added 'upload.fields' to update route to allow image updates
productRouter.post('/update', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), updateProduct);

export default productRouter;