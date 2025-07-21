import api from './api';
import { getToken } from './storage';

export async function getAllUsers() {
  const token = await getToken();
  const response = await api.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getUserById(id: string) {
  const token = await getToken();
  const response = await api.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUserById(id: string, data: any) {
  const token = await getToken();
  const response = await api.put(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteUserById(id: string) {
  const token = await getToken();
  const response = await api.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function verifyUser(id: string) {
  const token = await getToken();
  const response = await api.put(`/users/${id}/verify`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
} 