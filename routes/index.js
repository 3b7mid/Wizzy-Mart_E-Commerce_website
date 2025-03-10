import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import categoryRoute from './categoryRoute.js';
import subCategoryRoute from './subCategoryRoute.js';
import brandRoute from './brandRoute.js';
import prodcutRoute from './productRoute.js';
import reviewRoute from './reviewRoute.js';
import cartRoute from './cartRoute.js';
import orderRoute from './orderRoute.js';

const mountRoutes = (app) => {
    app.use('/api/auth', authRoute);
    app.use('/api/users', userRoute);
    app.use('/api/categories', categoryRoute);
    app.use('/api/subcategories', subCategoryRoute)
    app.use('/api/brands', brandRoute);
    app.use('/api/products', prodcutRoute);
    app.use('/api/reviews', reviewRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/orders', orderRoute);
    
};

export default mountRoutes;