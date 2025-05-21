import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createBrandValidator, BrandIDValidator, updateBrandValidator } from '../validators/brandValidator.js';
import { createBrand, getBrands, getBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(protect, allowedTo('admin'), createBrandValidator, createBrand);

router.route('/:brandId')
    .get(BrandIDValidator, getBrand)
    .put(protect, allowedTo('admin'), updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin'), BrandIDValidator, deleteBrand)    

export default router;