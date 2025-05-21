import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: 'https://wizzy-mart-e-commerce-website.vercel.app/',
        description: 'Production server'
      }
    ]
  },
  apis: ['./docs/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Wizzy Mart API Documentation"
  }));
}; 