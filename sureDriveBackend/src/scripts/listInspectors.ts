import mongoose from 'mongoose';
import { Inspector } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suredrive';

async function listInspectors() {
  await mongoose.connect(MONGO_URI);
  const inspectors = await Inspector.find();
  for (const inspector of inspectors) {
    console.log(inspector.toObject());
  }
  await mongoose.disconnect();
  console.log('Done.');
}

listInspectors().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 