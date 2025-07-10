import mongoose, { Document, Schema } from 'mongoose';

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IVehicle extends Document {
  vehicleId: string;
  plateNumber: string;
  vehicleModel: string; // renamed from model
  make: string;
  ownerId: string;
  status: VehicleStatus;
  lastInspection: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  vehicleId: { type: String, required: true, unique: true },
  plateNumber: { type: String, required: true, unique: true },
  vehicleModel: { type: String, required: true }, // renamed from model
  make: { type: String, required: true },
  ownerId: { type: String, required: true, ref: 'User' },
  status: { type: String, enum: Object.values(VehicleStatus), default: VehicleStatus.ACTIVE },
  lastInspection: { type: Date },
}, { timestamps: true });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema); 