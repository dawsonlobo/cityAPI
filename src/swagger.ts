import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Define the Swagger specification
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'City API',
      version: '1.0.0',
      description: 'A simple Express API built with Node.js and TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    tags: [
      {
        name: 'City API',
        description: 'Operations related to city management'
      }
    ],
    // You can also set a default tag for all operations
   // Will be populated from your route files
  },
  // Path to the API specs
  apis: ['./src/routes/*.ts'], // Add your routes directory
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };