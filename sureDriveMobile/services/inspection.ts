import api from './api';
import { getToken } from './storage';

export async function getAllInspections() {
  const token = await getToken();
  const response = await api.get('/inspections', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getInspectionById(id: string) {
  const token = await getToken();
  const response = await api.get(`/inspections/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createInspection(data: any) {
  const token = await getToken();
  const response = await api.post('/inspections', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateInspectionById(id: string, data: any) {
  const token = await getToken();
  const response = await api.put(`/inspections/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteInspectionById(id: string) {
  const token = await getToken();
  const response = await api.delete(`/inspections/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
} 