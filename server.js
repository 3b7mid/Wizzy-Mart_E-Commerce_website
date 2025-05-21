import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import sanitizeMiddleware from './middlewares/sanitizeMiddleware.js';
import { swaggerSetup } from './config/swagger.js';
import dbConnection from './config/db.js';
import ApiError from './utils/apiError.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';
import mountRoutes from './routes/index.js';
import { webhookCheckout } from './services/orderService.js';

// ==========================================
// Global Error Handlers
// ==========================================
process.on('uncaughtException', (err) => {
    console.error(`UncaughtException Error: ${err.name} | ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log(`Shutting down...`);
        process.exit(1);
    });
});

// ==========================================
// Database Connection
// ==========================================
dbConnection();

// ==========================================
// Express App Setup
// ==========================================
const app = express();

// ==========================================
// Security Middleware Configuration
// ==========================================

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://wizzy-mart-e-commerce-website.vercel.app', 'http://localhost:8000']
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
};

// Rate Limiting Configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/api-docs')
});

// Helmet Security Configuration
const helmetConfig = {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true
};

// ==========================================
// Apply Middleware
// ==========================================

// Security Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet(helmetConfig));
app.use(xss());
app.use(hpp({
    whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity'
    ],
}));
app.use(mongoSanitize());
app.use(sanitizeMiddleware);
app.use('/api', limiter);

// Body Parsing Middleware
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Compression Middleware
app.use(compression());

// ==========================================
// Special Route Handlers
// ==========================================
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);

// ==========================================
// Development Tools
// ==========================================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// ==========================================
// API Documentation
// ==========================================
swaggerSetup(app);

// ==========================================
// Routes
// ==========================================
mountRoutes(app);

// ==========================================
// Error Handling
// ==========================================
app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(errorHandler);

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT} in ${process.env.NODE_ENV} mode`);
});