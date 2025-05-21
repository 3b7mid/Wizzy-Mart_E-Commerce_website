import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import Review from '../models/reviewModel.js';

// Helper function to set productId and userId in request body
export const setProductIdAndUserIdToBody = (req) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
};

export const createReviewService = async (userId, productId, reviewData) => {
    const review = await Review.create({ ...reviewData, user: userId, product: productId });

    return review;
};

export const getReviewsService = async (productId, query) => {
    const filter = productId ? { product: productId } : {};
    const totalReviews = await Review.countDocuments(filter);

    const features = new ApiFeatures(Review.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .search(['feedback'])
        .paginate(totalReviews);

    const reviews = await features.mongooseQuery.exec();

    return {
        totalReviews,
        pagination: features.paginationResult,
        reviews
    };
};

export const getReviewService = async (reviewId, productId) => {
    const review = await Review.findOne({ _id: reviewId, product: productId });

    if (!review) {
        throw new ApiError('Review not found.', 404);
    }

    return review;
};

export const updateReviewService = async (userId, reviewId, productId, updateData) => {
    const updatedReview = await Review.findOneAndUpdate(
        { 
            _id: reviewId, 
            product: productId,
            user: userId 
        },
        updateData,
        { 
            new: true,
            runValidators: true
        }
    ).populate({
        path: 'user',
        select: 'userName profileImage'
    });

    if (!updatedReview) {
        throw new ApiError('Review not found or you are not authorized to update it.', 404);
    }

    return updatedReview;
};

export const deleteReviewService = async (userId, reviewId, productId) => {
    const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
        product: productId,
        user: userId
    });

    if (!deletedReview) {
        throw new ApiError('Review not found or you are not authorized to delete it.', 404);
    }

    return true;
};