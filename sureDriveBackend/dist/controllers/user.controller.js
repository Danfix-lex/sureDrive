"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
const getUsers = async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json(user);
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json(user);
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const user = await userService.deleteUser(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
};
exports.deleteUser = deleteUser;
const verifyUser = async (req, res) => {
    // Only admin/inspector should be able to call this (enforced by route middleware)
    const user = await userService.verifyUser(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User verified', user });
};
exports.verifyUser = verifyUser;
