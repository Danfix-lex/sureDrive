import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User, Driver } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suredrive';

async function migrateDrivers() {
  await mongoose.connect(MONGO_URI);
  const drivers = await Driver.find({ $or: [ { plateNumber: { $exists: false } }, { plateNumber: null } ] });
  for (const driver of drivers) {
    const d = driver as any;
    const oldUserId = d.userId;
    d.plateNumber = oldUserId;
    d.userId = uuidv4();
    await d.save();
    console.log(`Migrated driver: ${d.name}, oldUserId: ${oldUserId}, newUserId: ${d.userId}, plateNumber: ${d.plateNumber}`);
  }
  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrateDrivers().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
}); 