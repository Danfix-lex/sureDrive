import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { v4 as uuidv4 } from 'uuid';

const vehicleService = new VehicleService();

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    res.json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { plateNumber, vehicleModel, make, ownerId } = req.body;
    if (!plateNumber || !vehicleModel || !make || !ownerId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }
    
    const existing = await Vehicle.findOne({ plateNumber });
    if (existing) {
      return res.status(409).json({ 
        success: false,
        error: 'Vehicle with this plate number already exists' 
      });
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
    
    res.status(201).json({ 
      success: true,
      message: 'Vehicle created successfully', 
      data: vehicle 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Vehicle updated successfully', 
      data: vehicle 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Vehicle deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const searchVehicleByPlate = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber required' 
      });
    }
    
    const result = await vehicleService.searchByPlate(plateNumber as string);
    res.json({
      success: true,
      message: 'Vehicle search completed successfully',
      data: result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ 
        success: false,
        error: err.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Server error', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }
};

export const getVehicleByQR = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.params;
    const result = await vehicleService.getByQR(plateNumber);
    res.json({
      success: true,
      message: 'Vehicle retrieved by QR successfully',
      data: result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ 
        success: false,
        error: err.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Server error', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }
};

export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ 
        success: false,
        error: 'status required' 
      });
    }
    
    const vehicle = await vehicleService.updateStatus(id, status);
    res.json({ 
      success: true,
      message: 'Vehicle status updated successfully', 
      data: vehicle 
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ 
        success: false,
        error: err.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Server error', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }
};

export const verifyVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.verifyVehicle(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Vehicle verified successfully', 
      data: vehicle 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}; 