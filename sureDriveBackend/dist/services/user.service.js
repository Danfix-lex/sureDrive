"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
class UserService {
    async getUsers() {
        return User_1.User.find();
    }
    async getUserById(id) {
        return User_1.User.findById(id);
    }
    async updateUser(id, data) {
        return User_1.User.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteUser(id) {
        return User_1.User.findByIdAndDelete(id);
    }
    async verifyUser(id) {
        return User_1.User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    }
}
exports.UserService = UserService;
