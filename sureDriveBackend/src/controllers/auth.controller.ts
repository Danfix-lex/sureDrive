import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const authService = new AuthService();
const nigerianDLRegex = /^[A-Z]{3}\d{8}$/;
const nigerianPlateRegex = /^[A-Z]{3}-\d{3}[A-Z]{2}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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
    console.error('Register error:', err); // Add this line
    res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received:', username);
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({
        success: false,
        error: 'Username and password required'
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    console.log('User found:', user);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.userId, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    console.log('Token generated');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user.userId,
          name: user.name,
          username: user.username,
          phone: user.phone,
          nationalId: user.nationalId,
          role: user.role,
          language: user.language,
          isVerified: user.isVerified,
        },
      },
    });
    console.log('Login response sent');
  } catch (err) {
    console.error('Login error:', err); // <-- Add this line
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
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
    const { name, driverLicense, plateNumber, password } = req.body;
    if (!name || !driverLicense || !plateNumber || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, driver license, plate number, and password required' 
      });
    }
    if (!nigerianDLRegex.test(driverLicense)) {
      return res.status(400).json({
        success: false,
        error: 'Driver license must be in the format ABC12345678.'
      });
    }
    if (!nigerianPlateRegex.test(plateNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Plate number must be in the format ABC-123DE.'
      });
    }
    const result = await authService.driverLogin(name, driverLicense, plateNumber, password);
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
      console.log('400 Bad Request: Missing fields', { name, driverLicense, plateNumber, phone, password });
      return res.status(400).json({ 
        success: false,
        error: 'Name, driver license, plate number, phone, and password are required' 
      });
    }
    if (!nigerianDLRegex.test(driverLicense)) {
      return res.status(400).json({
        success: false,
        error: 'Driver license must be in the format ABC12345678.'
      });
    }
    if (!nigerianPlateRegex.test(plateNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Plate number must be in the format ABC-123DE.'
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      });
    }
    try {
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
      console.log('409 Conflict or Registration error:', err);
      res.status(409).json({ 
        success: false,
        error: err instanceof Error ? err.message : 'Registration error' 
      });
    }
  } catch (err) {
    console.log('500 Internal Server Error:', err);
    res.status(500).json({ 
      success: false,
      error: err instanceof Error ? err.message : 'Server error' 
    });
  }
}; 