import { Request, Response } from 'express';
import { Inspection, InspectionResult } from '../models/Inspection';
import { Vehicle, VehicleStatus } from '../models/Vehicle';

export const getInspections = async (req: Request, res: Response) => {
  try {
    const inspections = await Inspection.find();
    res.json({
      success: true,
      message: 'Inspections retrieved successfully',
      data: inspections,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const getInspectionById = async (req: Request, res: Response) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ 
        success: false,
        error: 'Inspection not found' 
      });
    }
    res.json({
      success: true,
      message: 'Inspection retrieved successfully',
      data: inspection,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const createInspection = async (req: Request, res: Response) => {
  try {
    const { plateNumber, inspectorId, checklist, result, qrCodeUrl } = req.body;
    if (!plateNumber || !inspectorId || !result) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber, inspectorId, and result are required' 
      });
    }
    
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    
    const inspection = new Inspection({
      inspectionId: `${plateNumber}-${Date.now()}`,
      vehicleId: plateNumber,
      inspectorId,
      result,
      checklist: checklist || [],
      qrCodeUrl: qrCodeUrl || '',
      timestamp: new Date(),
    });
    await inspection.save();
    
    let status = VehicleStatus.ACTIVE;
    if (result === InspectionResult.FAIL) status = VehicleStatus.SUSPENDED;
    if (result === InspectionResult.PASS) status = VehicleStatus.ACTIVE;
    
    await Vehicle.findByIdAndUpdate(vehicle._id, {
      status,
      lastInspection: new Date(),
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Inspection created successfully', 
      data: inspection 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const updateInspection = async (req: Request, res: Response) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inspection) {
      return res.status(404).json({ 
        success: false,
        error: 'Inspection not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Inspection updated successfully', 
      data: inspection 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const deleteInspection = async (req: Request, res: Response) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) {
      return res.status(404).json({ 
        success: false,
        error: 'Inspection not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Inspection deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const getInspectionHistory = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber required' 
      });
    }
    
    const inspections = await Inspection.find({ vehicleId: plateNumber }).sort({ timestamp: -1 });
    let expired = true;
    let lastInspectionDate = null;
    
    if (inspections.length > 0) {
      lastInspectionDate = inspections[0].timestamp;
      const threeHours = 1000 * 60 * 60 * 3;
      expired = (Date.now() - new Date(lastInspectionDate).getTime()) > threeHours;
    }
    
    res.json({
      success: true,
      message: 'Inspection history retrieved successfully',
      data: {
        inspections,
        lastInspectionDate,
        expired,
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
}; 