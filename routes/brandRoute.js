import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } from '../validators/brandValidator.js';
import { createBrand, getBrands, getBrand, updateBrand, deletebrand } from '../services/brandService.js';

const router = express.Router();

router.route('/')
    .get(getBrands)
    .post(protect, allowedTo('admin'), createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('admin'), updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('admin'), deleteBrandValidator, deletebrand)    

export default router;