import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wizzy Mart E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Wizzy Mart E-Commerce platform',
    },
    servers: [
      {
        url: 'https://wizzy-mart-e-commerce-website.vercel.app',
        description: 'Production'
      },
      {
        url: 'http://localhost:8000',
        description: 'Local'
      }
    ]
  },
  apis: ['./docs/*.js']
});

export const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};