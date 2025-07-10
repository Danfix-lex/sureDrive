import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};

export const verifyUser = async (req: Request, res: Response) => {
  // Only admin/inspector should be able to call this (enforced by route middleware)
  const user = await userService.verifyUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User verified', user });
}; 