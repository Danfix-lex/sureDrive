import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  INSPECTOR = 'inspector',
}

export interface IUser extends Document {
  userId: string;
  name: string;
  phone: string;
  nationalId: string;
  role: UserRole;
  language: string;
  isVerified: boolean;
  password: string;
  username?: string; // Add username, required for inspectors
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  nationalId: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  language: { type: String, default: 'en' },
  isVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // Add username
}, { timestamps: true, discriminatorKey: 'role' });

export const User = mongoose.model<IUser>('User', UserSchema);

// Driver and Inspector discriminators
export const Driver = User.discriminator('Driver', new Schema({}, { discriminatorKey: 'role' }));
export const Inspector = User.discriminator('Inspector', new Schema({}, { discriminatorKey: 'role' })); 