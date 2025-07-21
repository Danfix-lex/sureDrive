import api from './api';
import { getToken, saveProfile } from './storage';

// User registration (general)
export async function registerUser({ name, phone, nationalId, password, role, language, username }: any) {
  const response = await api.post('/auth/register', { name, phone, nationalId, password, role, language, username });
  return response.data;
}

// User login (admin/driver)
export async function login({ username, password }: any) {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
}

// Inspector login
export async function inspectorLogin({ username, password }: any) {
  const response = await api.post('/auth/inspector-login', { username, password });
  return response.data;
}

// Driver login (with name, driverLicense, plateNumber)
export async function driverLogin({ name, driverLicense, plateNumber, password }: any) {
  const response = await api.post('/auth/driver-login', { name, driverLicense, plateNumber, password });
  return response.data;
}

// Driver registration
export async function driverRegister({ name, driverLicense, plateNumber, phone, password, language }: any) {
  const response = await api.post('/auth/driver-register', { name, driverLicense, plateNumber, phone, password, language });
  return response.data;
}

export async function fetchProfile() {
  const token = await getToken();
  if (!token) throw new Error('No auth token found');
  const response = await api.get('/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Save profile to storage for global access
  await saveProfile(response.data.user || response.data);
  return response.data;
} 