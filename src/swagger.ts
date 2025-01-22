import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Node.js API',
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
        name: 'cities',  // This will replace 'default'
        description: 'API endpoints for cities'
      },
      {
        name: 'states',  // This will replace 'default'
        description: 'API endpoints for states'
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };