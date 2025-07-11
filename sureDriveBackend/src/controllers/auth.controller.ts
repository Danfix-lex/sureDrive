import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, nationalId, password, role, language, username } = req.body;
    if (!name || !phone || !nationalId || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }
    
    const existing = await User.findOne({ $or: [{ phone }, { nationalId }] });
    if (existing) {
      return res.status(409).json({ 
        success: false,
        error: 'User with this phone or nationalId already exists' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const user = new User({
      userId,
      name,
      phone,
      nationalId,
      password: hashedPassword,
      role,
      language: language || 'en',
      username: username || undefined,
      isVerified: false,
    });
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        nationalId: user.nationalId,
        role: user.role,
        language: user.language,
        username: user.username,
        isVerified: user.isVerified,
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

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true,
    message: 'User logged in (placeholder)' 
  });
};

export const inspectorLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password required' 
      });
    }
    
    const result = await authService.inspectorLogin(username, password);
    res.json({
      success: true,
      message: 'Inspector login successful',
      data: {
        token: result.token,
        inspector: {
          userId: (result.inspector as any).userId,
          name: (result.inspector as any).name,
          username: (result.inspector as any).username,
          phone: (result.inspector as any).phone,
          nationalId: (result.inspector as any).nationalId,
          role: (result.inspector as any).role,
          language: (result.inspector as any).language,
          isVerified: (result.inspector as any).isVerified,
        },
      },
    });
  } catch (err) {
    res.status(401).json({ 
      success: false,
      error: err instanceof Error ? err.message : 'Invalid credentials' 
    });
  }
};

export const driverLogin = async (req: Request, res: Response) => {
  try {
    const { name, driverLicense, plateNumber } = req.body;
    if (!name || !driverLicense || !plateNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, driver license, and plate number required' 
      });
    }
    
    const result = await authService.driverLogin(name, driverLicense, plateNumber);
    res.json({
      success: true,
      message: 'Driver login successful',
      data: {
        token: result.token,
        driver: {
          userId: (result.driver as any).userId,
          name: (result.driver as any).name,
          phone: (result.driver as any).phone,
          nationalId: (result.driver as any).nationalId,
          role: (result.driver as any).role,
          language: (result.driver as any).language,
          isVerified: (result.driver as any).isVerified,
        },
      },
    });
  } catch (err) {
    res.status(401).json({ 
      success: false,
      error: err instanceof Error ? err.message : 'Invalid credentials' 
    });
  }
};

export const driverRegister = async (req: Request, res: Response) => {
  try {
    const { name, driverLicense, plateNumber, phone, password, language } = req.body;
    if (!name || !driverLicense || !plateNumber || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, driver license, plate number, phone, and password are required' 
      });
    }
    
    const driver = await authService.driverRegister({ name, driverLicense, plateNumber, phone, password, language });
    res.status(201).json({
      success: true,
      message: 'Driver registered successfully, pending verification',
      data: {
        userId: (driver as any).userId,
        name: (driver as any).name,
        phone: (driver as any).phone,
        nationalId: (driver as any).nationalId,
        role: (driver as any).role,
        language: (driver as any).language,
        isVerified: (driver as any).isVerified,
      },
    });
  } catch (err) {
    res.status(409).json({ 
      success: false,
      error: err instanceof Error ? err.message : 'Registration error' 
    });
  }
}; 