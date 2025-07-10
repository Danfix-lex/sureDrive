import { Vehicle } from '../models/Vehicle';
import { Driver } from '../models/User';

export class VehicleService {
  async searchByPlate(plateNumber: string) {
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) throw new Error('Vehicle not found');
    const driver = await Driver.findOne({ userId: plateNumber });
    return { vehicle, driver };
  }

  async getByQR(plateNumber: string) {
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) throw new Error('Vehicle not found');
    const driver = await Driver.findOne({ userId: plateNumber });
    return { vehicle, driver };
  }

  async updateStatus(id: string, status: string) {
    const vehicle = await Vehicle.findByIdAndUpdate(id, { status }, { new: true });
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  async verifyVehicle(id: string) {
    return Vehicle.findByIdAndUpdate(id, { status: 'active' }, { new: true });
  }
} 