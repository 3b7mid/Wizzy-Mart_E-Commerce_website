import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import ApiError from '../utils/apiError.js';

const uploadToCloudinary = (buffer, filename, folder, format = 'jpeg', quality = 'auto') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                resource_type: 'image',
                format,
                quality,
            },
            (error, result) => {
                if (error) {
                    reject(new ApiError(`Cloudinary Upload Error: ${error.message}`, 500));
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(buffer);
    });
};

export const resizeUserImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(); // Skip if no image uploaded

    try {
        const profileImageFileName = `user-${uuidv4()}-profile.jpeg`;

        // Resize image
        const buffer = await sharp(req.file.buffer)
            .resize(500, 500, {
                fit: sharp.fit.cover,
                position: sharp.strategy.center
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, profileImageFileName, 'users');

        req.body.profileImage = result.secure_url; // Save URL to request body

        next();
    } catch (error) {
        next(new ApiError('Error processing image upload', 500));
    }
});

export const resizecategoryImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(); // Skip if no image uploaded

    try {
        const categoryImageFileName = `category-${uuidv4()}-.jpeg`;

        // Resize image
        const buffer = await sharp(req.file.buffer)
            .resize(500, 500, {
                fit: sharp.fit.cover,
                position: sharp.strategy.center
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, categoryImageFileName, 'categories');

        req.body.categoryImage = result.secure_url; // Save URL to request body

        next();
    } catch (error) {
        next(new ApiError('Error processing image upload', 500));
    }
});

export const resizeProductImages = asyncHandler(async (req, res, next) => {
    try {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];

        if (req.files?.imageCover) {
            const coverFile = req.files.imageCover[0];

            if (!allowedFormats.includes(coverFile.mimetype)) {
                return next(new ApiError('Invalid image format. Only JPEG, PNG, and WEBP are allowed.', 400));
            }

            const imageCoverFileName = `product-${uuidv4()}-cover`;

            const buffer = await sharp(coverFile.buffer)
                .resize(1200, 1600, { fit: sharp.fit.cover, position: sharp.strategy.center })
                .toFormat('webp')
                .webp({ quality: 90 })
                .toBuffer();

            const result = await uploadToCloudinary(buffer, imageCoverFileName, 'azirProducts');

            req.body.imageCover = result.secure_url;
        }

        if (req.files?.images) {
            req.body.images = (await Promise.allSettled(
                req.files.images.map(async (img, index) => {
                    try {
                        if (!allowedFormats.includes(img.mimetype)) return null;

                        const imageName = `product-${uuidv4()}-${index + 1}`;

                        const buffer = await sharp(img.buffer)
                            .resize(1200, 1600, { fit: sharp.fit.cover, position: sharp.strategy.center })
                            .toFormat('webp')
                            .webp({ quality: 90 })
                            .toBuffer();

                        const result = await uploadToCloudinary(buffer, imageName, 'azirProducts');
                        return result.secure_url;
                    } catch (error) {
                        console.error(`Error uploading image ${index + 1}:`, error);
                        return null;
                    }
                })
            )).filter(res => res.status === 'fulfilled' && res.value).map(res => res.value);
        }

        next();
    } catch (error) {
        next(new ApiError(`Image processing error: ${error.message}`, 500));
    }
});
