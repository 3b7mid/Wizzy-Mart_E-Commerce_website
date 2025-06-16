export const sanitizeUser = (user) => {
    return {
        id: user._id,
        displayName: user.displayName,
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        secondaryEmail: user.secondaryEmail,
        phoneNumber: user.phoneNumber,
        country: user.country,
        states: user.states,
        zipCode: user.zipCode,
        profileImage: user.profileImage,
        role: user.role,
        wishlist: user.wishlist,
        addresses: user.addresses,
        active: user.active
    };
};

export const sanitizeCategory = (category) => {
    return {
        id: category._id,
        name: category.name,
        slug: category.slug,
        categoryImage: category.categoryImage
    };
};

export const sanitizeSubCategory = (subcategory) => {
    return {
        id: subcategory._id,
        name: subcategory.name,
        slug: subcategory.slug,
        category: subcategory.category
    };
};

export const sanitizeBrand = (brand) => {
    return {
        id: brand._id,
        name: brand.name,
        slug: brand.slug,
        category: brand.category,
        subCategory: brand.subCategory
    };
};

export const sanitizeProduct = (product) => {
    return {
        id: product._id,
        name: product.name,
        slug: product.slug,
        seller: product.seller,
        description: product.description,
        sku: product.sku,
        model: product.model,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        variants: product.variants,
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount,
        discountPercent: product.discountPercent,
        quantity: product.quantity,
        sold: product.sold,
        availability: product.availability,
        ratingsAverage: product.ratingsAverage,
        ratingsQuantity: product.ratingsQuantity,
        imageCover: product.imageCover,
        images: product.images,
        features: product.features,
        specs: product.specs,
        tags: product.tags,
        size: product.size,
        weight: product.weight,
        shippingInfo: product.shippingInfo,
        warranty: product.warranty,
        guarantee: product.guarantee,
        options: product.options,
        reviews: product.reviews
    };
};

export const sanitizeReview = (review) => {
    return {
        id: review._id,
        ratings: review.ratings,
        feedback: review.feedback,
        timeElapsed: review.timeElapsed,
        user: {
            id: review.user?._id,
            userName: review.user?.userName,
            profileImage: review.user?.profileImage
        },
        product: review.product
    };
};

export const sanitizeCart = (cart) => {
    return {
        id: cart._id,
        user: cart.user,
        status: cart.status,
        totalItems: cart.totalItems,
        totalCartPrice: cart.totalCartPrice,
        totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
        savings: cart.savings,
        coupon: cart.coupon,
        cartItems: cart.cartItems
    };
};

export const sanitizeCoupon = (coupon) => {
    return {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        discount: coupon.discount,
        expiresAt: coupon.expiresAt,
        isExpired: coupon.isExpired,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        description: coupon.description,
        createdBy: coupon.createdBy,
        categories: coupon.categories,
        products: coupon.products
    };
};

export const sanitizeOrder = (order) => {
    return {
        id: order._id,
        user: order.user,
        cartItems: order.cartItems,
        shippingAddress: order.shippingAddress,
        shippingPrice: order.shippingPrice,
        paymentMethodType: order.paymentMethodType,
        status: order.status,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        totalOrderPrice: order.totalOrderPrice,
        totalPriceAfterDiscount: order.totalPriceAfterDiscount
    };
};

export const sanitizeChatHistory = (history) => {
    return {
        id: history._id,
        message: history.message,
        reply: history.reply
    };
};