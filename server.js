import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
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
    console.error(`UncaughtException: ${err.name} | ${err.message}`);
    process.exit(1);
});

const app = express();
app.set('trust proxy', 1);

dbConnection();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://wizzy-mart-e-commerce-website.vercel.app/', 'http://localhost:8000']
        : '*',
    credentials: true,
}));
app.options('*', cors());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/api-docs')
}));

app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

app.use(hpp());
app.use(mongoSanitize());
app.use(sanitizeMiddleware);

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

app.use(compression());

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

swaggerSetup(app);

mountRoutes(app);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => process.exit(1));
});