import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const role = req.query.role;
    let users;
    if (role) {
      users = await userService.getUsersByRole(role as string);
    } else {
      users = await userService.getUsers();
    }
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users.map(user => ({
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        nationalId: user.nationalId,
        role: user.role,
        language: user.language,
        username: user.username,
        isVerified: user.isVerified,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({
      success: true,
      message: 'User retrieved successfully',
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
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({
      success: true,
      message: 'User updated successfully',
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
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.verifyUser(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.json({
      success: true,
      message: 'User verified successfully',
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
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}; 