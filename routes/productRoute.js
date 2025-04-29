import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } from '../validators/prodcutValidator.js';
import { uploadProductImages } from '../middleware/multerMiddleware.js';
import { resizeProductImages } from '../middleware/cloudinaryMiddleware.js';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../services/productService.js';
import reviewRoute from '../routes/reviewRoute.js';

const router = express.Router();

router.use('/:productId/reviews', reviewRoute)

router.route('/')
    .get(getProducts)
    .post(protect, allowedTo('admin'), uploadProductImages, resizeProductImages, createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('admin'), uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

export default router;