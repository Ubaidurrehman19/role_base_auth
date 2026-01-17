import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoDBConnection from './dbConnection.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoDBConnection();

// routes
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
