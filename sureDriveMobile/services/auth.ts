import api from './api';

export async function login(username: string, password: string) {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
}

export async function register(data: {
  name: string;
  phone: string;
  nationalId: string;
  password: string;
  role: string;
  language?: string;
  username?: string;
}) {
  const response = await api.post('/auth/register', data);
  return response.data;
} 