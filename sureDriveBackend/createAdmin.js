const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/sureDrive';

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  phone: String,
  nationalId: String,
  role: String,
  language: String,
  isVerified: Boolean,
  password: String,
  username: String
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect(uri);

  const hashedPassword = await bcrypt.hash('youradminpassword', 10);

  const admin = new User({
    userId: 'admin-001',
    name: 'Super Admin',
    phone: '1112223333',
    nationalId: 'ADMIN001',
    role: 'admin',
    language: 'en',
    isVerified: true,
    password: hashedPassword,
    username: 'admin'
  });

  await admin.save();
  console.log('Admin user created!');
  mongoose.disconnect();
}

createAdmin(); 