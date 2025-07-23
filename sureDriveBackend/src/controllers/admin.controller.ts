import { Request, Response } from 'express';
import { Inspector, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const createInspector = async (req: Request, res: Response) => {
  try {
    const { name, username, password, phone, nationalId, language } = req.body;
    if (!name || !username || !password || !phone || !nationalId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }
    
    const existing = await Inspector.findOne({ username });
    if (existing) {
      return res.status(409).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const inspector = new Inspector({
      userId,
      name,
      username,
      password: hashedPassword,
      phone,
      nationalId,
      language: language || 'en',
      isVerified: true,
      role: 'inspector',
    });
    await inspector.save();
    const saved = inspector as any;
    
    res.status(201).json({
      success: true,
      message: 'Inspector created successfully',
      data: {
        userId: saved.userId,
        name: saved.name,
        username: saved.username,
        phone: saved.phone,
        nationalId: saved.nationalId,
        language: saved.language,
        role: saved.role,
        isVerified: saved.isVerified,
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