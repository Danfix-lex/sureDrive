import { User } from '../models/User';

export class UserService {
  async getUsers() {
    return User.find();
  }

  async getUserById(id: string) {
    return User.findById(id);
  }

  async updateUser(id: string, data: any) {
    return User.findOneAndUpdate({ userId: id }, data, { new: true });
  }

  async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }

  async verifyUser(id: string) {
    return User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
  }

  async getUsersByRole(role: string) {
    return User.find({ role });
  }
} 