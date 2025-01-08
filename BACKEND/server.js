import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import docsRouter from './docs.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api', authRoutes);

// Swagger documentation
app.use('/api-docs', docsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running.' });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
