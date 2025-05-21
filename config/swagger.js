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
        url: process.env.NODE_ENV === 'production' 
          ? 'https://wizzy-mart-e-commerce-website.vercel.app'
          : 'http://localhost:8000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ]
  },
  apis: [join(__dirname, '../docs/*.js')],
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app) => {
  try {
    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve);
    
    // Setup Swagger UI
    app.get('/api-docs', swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Wizzy Mart API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showCommonExtensions: true,
        syntaxHighlight: {
          activate: true,
          theme: 'monokai'
        }
      }
    }));

    // Serve Swagger JSON
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    console.log('Swagger documentation setup successfully');
  } catch (error) {
    console.error('Error setting up Swagger documentation:', error);
  }
}; 