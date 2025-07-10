import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle.routes';
import inspectionRoutes from './routes/inspection.routes';
import adminRoutes from './routes/admin.routes';
import driverRoutes from './routes/driver.routes';

import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sureDrive';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

export default app; 