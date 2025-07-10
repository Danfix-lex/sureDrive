import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { v4 as uuidv4 } from 'uuid';

const vehicleService = new VehicleService();

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { plateNumber, vehicleModel, make, ownerId } = req.body;
    if (!plateNumber || !vehicleModel || !make || !ownerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await Vehicle.findOne({ plateNumber });
    if (existing) {
      return res.status(409).json({ error: 'Vehicle with this plate number already exists' });
    }
    const vehicleId = uuidv4();
    const vehicle = new Vehicle({
      vehicleId,
      plateNumber,
      vehicleModel,
      make,
      ownerId,
    });
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle created', vehicle });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle updated', vehicle });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const searchVehicleByPlate = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) return res.status(400).json({ error: 'plateNumber required' });
    const result = await vehicleService.searchByPlate(plateNumber as string);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Server error', details: err });
    }
  }
};

export const getVehicleByQR = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.params;
    const result = await vehicleService.getByQR(plateNumber);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Server error', details: err });
    }
  }
};

export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    const vehicle = await vehicleService.updateStatus(id, status);
    res.json({ message: 'Vehicle status updated', vehicle });
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Server error', details: err });
    }
  }
};

export const verifyVehicle = async (req: Request, res: Response) => {
  // Only admin/inspector should be able to call this (enforced by route middleware)
  const vehicle = await vehicleService.verifyVehicle(req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json({ message: 'Vehicle verified', vehicle });
}; 