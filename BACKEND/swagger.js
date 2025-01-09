import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Google Authenticator API',
    version: '1.0.0',
    description: 'API documentation for the Google Authenticator project',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [
    resolve(__dirname, './routes/*.js'), 
    resolve(__dirname, './controllers/*.js'), 
  ],
});
