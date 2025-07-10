import { Request, Response } from 'express';
import { Inspector, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const createInspector = async (req: Request, res: Response) => {
  try {
    const { name, username, password, phone, nationalId, language } = req.body;
    if (!name || !username || !password || !phone || !nationalId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if username is unique
    const existing = await Inspector.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate unique userId
    const userId = uuidv4();
    // Create inspector
    const inspector = new Inspector({
      userId,
      name,
      username,
      password: hashedPassword,
      phone,
      nationalId,
      language: language || 'en',
      isVerified: true,
    });
    await inspector.save();
    const saved = inspector as any;
    res.status(201).json({
      message: 'Inspector created',
      inspector: {
        userId: saved.userId,
        name: saved.name,
        username: saved.username,
        phone: saved.phone,
        nationalId: saved.nationalId,
        language: saved.language,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
}; 