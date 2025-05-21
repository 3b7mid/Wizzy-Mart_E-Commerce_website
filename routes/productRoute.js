import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createProductValidator, ProductIDValidator, updateProductValidator } from '../validators/productValidator.js';
import { uploadProductImages } from '../middlewares/multerMiddleware.js';
import { resizeProductImages } from '../middlewares/cloudinaryMiddleware.js';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import reviewRoute from '../routes/reviewRoute.js';

const router = express.Router();

router.use('/:productId/reviews', reviewRoute)

router.route('/')
    .get(getProducts)
    .post(protect, allowedTo('admin', 'seller'), uploadProductImages, resizeProductImages, createProductValidator, createProduct);

router.route('/my-products')
    .get(protect, allowedTo('seller'), getProducts);

router.route('/:productId')
    .get(ProductIDValidator, getProduct)
    .put(protect, allowedTo('admin', 'seller'), uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(protect, allowedTo('admin', 'seller'), ProductIDValidator, deleteProduct);

export default router;