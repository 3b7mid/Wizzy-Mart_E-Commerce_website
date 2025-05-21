import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get absolute path to docs directory
const docsPath = join(__dirname, '..', 'docs');

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
        url: 'https://wizzy-mart-e-commerce-website.vercel.app/',
        description: 'Production server'
      },
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      }
    ]
  },

  apis: [`${docsPath}/*.js`, `${docsPath}/swagger.js`],
};

// Generate Swagger specs
const specs = swaggerJsdoc(options);

export const swaggerSetup = (app) => {
  try {
    // Log the specs to verify they're being generated
    console.log('Swagger specs generated:', Object.keys(specs.paths || {}).length, 'paths found');
    console.log('Docs path:', docsPath);

    // Serve Swagger UI with CORS headers
    app.use('/api-docs', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    }, swaggerUi.serve);
    
    // Setup Swagger UI with enhanced options
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
        },
        tryItOutEnabled: true,
        requestSnippetsEnabled: true
      }
    }));

    // Serve Swagger JSON with CORS headers
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.send(specs);
    });

    console.log('Swagger documentation setup successfully');
  } catch (error) {
    console.error('Error setting up Swagger documentation:', error);
    // Log more detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      specs: specs ? 'Specs generated' : 'No specs generated',
      docsPath,
      paths: specs?.paths ? Object.keys(specs.paths) : 'No paths found'
    });
  }
}; 