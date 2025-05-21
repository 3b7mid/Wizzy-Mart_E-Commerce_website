import asyncHandler from 'express-async-handler';
import { sanitizeProduct } from '../utils/sanitizeData.js';
import { createProductService, getProductsService, getProductService, updateProductService, deleteProductService } from '../services/productService.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin/Seller)
export const createProduct = asyncHandler(async (req, res) => {
    const product = await createProductService(req.user._id, req.body);

    res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: sanitizeProduct(product)
    });
});

// @desc    Get products (all or seller-specific)
// @route   GET /api/products          -> for all products (public)
// @route   GET /api/products/my-products -> for seller's products (private)
// @access  Public or Private
export const getProducts = asyncHandler(async (req, res) => {
    const isSellerRoute = req.originalUrl.includes('/my-products');
    const { totalProducts, pagination, products } = await getProductsService(req, isSellerRoute);

    res.status(200).json({
        success: true,
        result: totalProducts,
        pagination,
        data: products.map(sanitizeProduct)
    });
});

// @desc    Get a product
// @route   GET /api/products/:productId
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await getProductService(productId);

    res.status(200).json({
        success: true,
        data: sanitizeProduct(product)
    });
});

// @desc    Update a product
// @route   PUT /api/products/:productId
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await updateProductService(req.user._id, productId, req.body);

    res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        data: sanitizeProduct(product)
    });
});

// @desc    Delete a product
// @route   DELETE /api/products/:productId
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    await deleteProductService(req.user._id, productId);

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully.'
    });
});