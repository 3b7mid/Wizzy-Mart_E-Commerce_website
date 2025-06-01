import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import sanitizeMiddleware from './middlewares/sanitizeMiddleware.js';
import { swaggerSetup } from './config/swagger.js';

import dbConnection from './config/db.js';
import ApiError from './utils/apiError.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';
import mountRoutes from './routes/index.js';
import { webhookCheckout } from './services/orderService.js';

process.on('uncaughtException', (err) => {
    console.error(`UncaughtException Error: ${err.name} | ${err.message}`);
    process.exit(1);
});

dbConnection();

const app = express();

app.use(cors());
app.options('*', cors());
app.use(compression());

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

app.use(express.json({ limit: '20kb' }));

app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

app.use(mongoSanitize());
app.use(sanitizeMiddleware);
app.use(hpp({
    whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity'
    ],
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message:
        'Too many requests from this IP, please try again after 15 minutes'

});

app.set('trust proxy', 1);
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
};

swaggerSetup(app);

mountRoutes(app);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log(`Shutting down...`);
        process.exit(1);
    });
});