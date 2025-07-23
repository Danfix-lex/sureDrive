import { Request, Response } from 'express';
import { Inspection } from '../models/Inspection';
import { Vehicle } from '../models/Vehicle';
import { InspectionBooking } from '../models/InspectionBooking';
import { Payment } from '../models/Payment';
import { SupportIssue } from '../models/SupportIssue';
import { SupportChat } from '../models/SupportChat';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import { io } from '../server';
import { InspectionService } from '../services/inspection.service';
import { PaymentService } from '../services/payment.service';
import { SupportService } from '../services/support.service';

const inspectionService = new InspectionService();
const paymentService = new PaymentService();
const supportService = new SupportService();

export const viewInspectionStatus = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber required' 
      });
    }
    
    const status = await inspectionService.getInspectionStatus(plateNumber as string);
    res.json({
      success: true,
      message: 'Inspection status retrieved successfully',
      data: status,
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

export const bookInspection = async (req: Request, res: Response) => {
  try {
    const { plateNumber, preferredDate } = req.body;
    if (!plateNumber || !preferredDate) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber and preferredDate required' 
      });
    }
    
    const booking = await inspectionService.bookInspection(plateNumber, preferredDate);
    res.status(201).json({ 
      success: true,
      message: 'Inspection booking created successfully', 
      data: booking 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber required' 
      });
    }
    
    const inspection = await Inspection.findOne({ vehicleId: plateNumber, result: 'pass' }).sort({ timestamp: -1 });
    if (!inspection) {
      return res.status(404).json({ 
        success: false,
        error: 'No passed inspection found' 
      });
    }
    
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    
    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inspection-certificate-${plateNumber}.pdf`);
    doc.text('Vehicle Inspection Certificate', { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`Plate Number: ${plateNumber}`);
    doc.text(`Inspection Date: ${inspection.timestamp}`);
    doc.text(`Result: ${inspection.result}`);
    doc.text(`Inspector ID: ${inspection.inspectorId}`);
    doc.text(`Vehicle Model: ${(vehicle as any).vehicleModel}`);
    doc.text(`Vehicle Make: ${(vehicle as any).make}`);
    doc.text(`Status: ${(vehicle as any).status}`);
    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { plateNumber, type, amount } = req.body;
    if (!plateNumber || !type || !amount) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber, type, and amount required' 
      });
    }
    
    const payment = await paymentService.makePayment(plateNumber, type, amount);
    res.status(201).json({ 
      success: true,
      message: 'Payment recorded successfully', 
      data: payment 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const getTraffic = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ 
        success: false,
        error: 'origin and destination required' 
      });
    }
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin as string)}&destination=${encodeURIComponent(destination as string)}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    
    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No route found' 
      });
    }
    
    const summary = data.routes[0].summary;
    const legs = data.routes[0].legs[0];
    const duration = legs.duration.text;
    const distance = legs.distance.text;
    
    res.json({ 
      success: true,
      message: 'Traffic information retrieved successfully',
      data: { 
        summary, 
        duration, 
        distance, 
        raw: data 
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

export const reportIssue = async (req: Request, res: Response) => {
  try {
    const { plateNumber, message } = req.body;
    if (!plateNumber || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber and message required' 
      });
    }
    
    const issue = new SupportIssue({ plateNumber, message, status: 'open' });
    await issue.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Issue reported successfully', 
      data: issue 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const chatSupport = async (req: Request, res: Response) => {
  try {
    const { plateNumber, message, sender } = req.body;
    if (!plateNumber || !message || !sender) {
      return res.status(400).json({ 
        success: false,
        error: 'plateNumber, message, and sender required' 
      });
    }
    
    const chat = new SupportChat({ plateNumber, message, sender });
    await chat.save();
    
    io.emit('chat message', { plateNumber, message, sender, createdAt: chat.createdAt });
    
    res.status(201).json({ 
      success: true,
      message: 'Message sent to support successfully', 
      data: chat 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
}; 

export const getPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    // Fetch payments where the ownerId or userId matches the logged-in user
    const payments = await Payment.find({ $or: [{ ownerId: userId }, { userId }] });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const getSupportIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    // Fetch support issues where the userId or ownerId matches the logged-in user
    const issues = await SupportIssue.find({ $or: [{ userId }, { ownerId: userId }] });
    res.json({ success: true, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
}; 