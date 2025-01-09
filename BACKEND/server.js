import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import docsRouter from './docs.js';

const app = express();


app.use(express.json());
app.use(cors());


app.use('/api', authRoutes);


app.use('/api-docs', docsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running.' });
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
