import express from 'express';
import { createBrand, getBrands, getBrand, updateBrand, deletebrand } from '../services/brandService.js';
import { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } from '../middlewares/brandMiddleware.js';
import { protect, allowedTo } from '../services/authService.js';
const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(protect, allowedTo('admin'), createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('admin'), updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin'), deleteBrandValidator, deletebrand)    

export default router;