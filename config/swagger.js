import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wizzy Mart E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Wizzy Mart E-Commerce platform',
      contact: {
        name: 'Youssef Abdelhamid',
        email: 'yabdelhamid705@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: 'https://wizzy-mart-e-commerce-website.vercel.app',
        description: 'Production server'
      }
    ]
  },
  apis: [join(__dirname, '../docs/*.js')], // Use absolute path
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app) => {
  try {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Wizzy Mart API Documentation"
    }));
    console.log('Swagger documentation setup successfully');
  } catch (error) {
    console.error('Error setting up Swagger documentation:', error);
  }
}; 