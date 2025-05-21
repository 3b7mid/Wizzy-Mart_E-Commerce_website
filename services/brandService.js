import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import Brand from '../models/brandModel.js';

export const createBrandService = async ({ name, slug, category, subCategory }) => {
    const brand = await Brand.create({ name, slug, category, subCategory });

    return brand;
};

export const getBrandsService = async (query) => {
    const totalBrands = await Brand.countDocuments();

    const features = new ApiFeature(Brand.find(), query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalBrands)

    const brands = await features.mongooseQuery.exec();

    return {
        totalBrands,
        pagination: features.paginationResult,
        brands
    };
};

export const getBrandService = async (brandId) => {
    const brand = await Brand.findById(brandId);

    if (!brand) {
        throw new ApiError('Brand not found', 404);
    }

    return brand;
};

export const updateBrandService = async (brandId, updates) => {
    const brand = await Brand.findByIdAndUpdate(brandId, updates, { new: true, runValidators: true });

    if (!brand) {
        throw new ApiError('Brand not found', 404);
    }

    return brand;
};

export const deleteBrandService = async (brandId) => {
    const brand = await Brand.findByIdAndDelete(brandId);

    if (!brand) {
        throw new ApiError('Brand not found', 404);
    }

    return true;
}