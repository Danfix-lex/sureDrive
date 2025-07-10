"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInspector = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const createInspector = async (req, res) => {
    try {
        const { name, username, password, phone, nationalId, language } = req.body;
        if (!name || !username || !password || !phone || !nationalId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if username is unique
        const existing = await User_1.Inspector.findOne({ username });
        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Generate unique userId
        const userId = (0, uuid_1.v4)();
        // Create inspector
        const inspector = new User_1.Inspector({
            userId,
            name,
            username,
            password: hashedPassword,
            phone,
            nationalId,
            role: User_1.UserRole.INSPECTOR,
            language: language || 'en',
            isVerified: true,
        });
        await inspector.save();
        const saved = inspector;
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
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.createInspector = createInspector;
