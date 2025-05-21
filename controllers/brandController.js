import asyncHandler from 'express-async-handler';
import { sanitizeBrand } from '../utils/sanitizeData.js';
import { createBrandService, deleteBrandService, getBrandService, getBrandsService, updateBrandService } from '../services/brandService.js';

// @desc    Create a subCategory 
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = asyncHandler(async (req, res) => {
    const brand = await createBrandService(req.body);

    res.status(201).json({
        success: true,
        message: 'Brand created successfully.',
        data: sanitizeBrand(brand)
    });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
    const { totalBrands, pagination, brands } = await getBrandsService(req.query);

    res.status(200).json({
        success: true,
        result: totalBrands,
        pagination,
        data: brands.map(sanitizeBrand)
    });
});

// @desc    Get a brand
// @route   GET @access  Public
// route    /api/brands/:brandId
export const getBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    const brand = await getBrandService(brandId);

    res.status(200).json({
        success: true,
        data: sanitizeBrand(brand)
    });
});

// @desc    Update a brand
// @route   PUT /api/brands/:brandId
// @access  Private/Admin
export const updateBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    const brand = await updateBrandService(brandId, req.body);

    res.status(200).json({
        success: true,
        message: 'Brand updated successfully.',
        data: sanitizeBrand(brand)
    });
});

// @desc    Delete a brand
// @route   PUT /api/brands/:brandId
// @access  Private/Admin
export const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    
    await deleteBrandService(brandId);

    res.status(200).json({
        success: true,
        message: 'Brand deleted successfully.'
    });
});