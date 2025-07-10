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
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check for duplicate phone or nationalId
    const existing = await User.findOne({ $or: [{ phone }, { nationalId }] });
    if (existing) {
      return res.status(409).json({ error: 'User with this phone or nationalId already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate unique userId
    const userId = uuidv4();
    // Create user
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
      message: 'User registered',
      user: {
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        nationalId: user.nationalId,
        role: user.role,
        language: user.language,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err instanceof Error ? err.message : err });
  }
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'User logged in (placeholder)' });
};

export const inspectorLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const result = await authService.inspectorLogin(username, password);
    res.json({
      message: 'Inspector login successful',
      token: result.token,
      inspector: result.inspector,
    });
  } catch (err) {
    res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid credentials' });
  }
};

export const driverLogin = async (req: Request, res: Response) => {
  try {
    const { name, driverLicense, plateNumber } = req.body;
    if (!name || !driverLicense || !plateNumber) {
      return res.status(400).json({ error: 'Name, driver license, and plate number required' });
    }
    const result = await authService.driverLogin(name, driverLicense, plateNumber);
    res.json({
      message: 'Driver login successful',
      token: result.token,
      driver: result.driver,
    });
  } catch (err) {
    res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid credentials' });
  }
};

export const driverRegister = async (req: Request, res: Response) => {
  try {
    const { name, driverLicense, plateNumber, phone, language } = req.body;
    if (!name || !driverLicense || !plateNumber || !phone) {
      return res.status(400).json({ error: 'Name, driver license, plate number, and phone required' });
    }
    const driver = await authService.driverRegister({ name, driverLicense, plateNumber, phone, language });
    res.status(201).json({
      message: 'Driver registered, pending verification',
      driver,
    });
  } catch (err) {
    res.status(409).json({ error: err instanceof Error ? err.message : 'Registration error' });
  }
}; 