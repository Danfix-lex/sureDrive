"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const Vehicle_1 = require("../models/Vehicle");
const User_1 = require("../models/User");
class VehicleService {
    async searchByPlate(plateNumber) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ plateNumber });
        if (!vehicle)
            throw new Error('Vehicle not found');
        const driver = await User_1.Driver.findOne({ userId: plateNumber });
        return { vehicle, driver };
    }
    async getByQR(plateNumber) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ plateNumber });
        if (!vehicle)
            throw new Error('Vehicle not found');
        const driver = await User_1.Driver.findOne({ userId: plateNumber });
        return { vehicle, driver };
    }
    async updateStatus(id, status) {
        const vehicle = await Vehicle_1.Vehicle.findByIdAndUpdate(id, { status }, { new: true });
        if (!vehicle)
            throw new Error('Vehicle not found');
        return vehicle;
    }
    async verifyVehicle(id) {
        return Vehicle_1.Vehicle.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    }
}
exports.VehicleService = VehicleService;
