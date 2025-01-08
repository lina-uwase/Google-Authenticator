import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const router = express.Router();

// Serve Swagger documentation at /api-docs
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
