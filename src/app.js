import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import mongoDBConnection from './dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import roleRoutes from './routes/roleRoutes.js';

const app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoDBConnection();

// routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/roles', roleRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
