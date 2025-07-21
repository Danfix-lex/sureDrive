import api from './api';
import { getToken } from './storage';

export async function getAllVehicles() {
  const token = await getToken();
  const response = await api.get('/vehicles', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getVehicleById(id: string) {
  const token = await getToken();
  const response = await api.get(`/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createVehicle(data: any) {
  const token = await getToken();
  const response = await api.post('/vehicles', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateVehicleById(id: string, data: any) {
  const token = await getToken();
  const response = await api.put(`/vehicles/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteVehicleById(id: string) {
  const token = await getToken();
  const response = await api.delete(`/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
} 