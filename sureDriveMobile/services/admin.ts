import api from './api';
import { getToken } from './storage';

export async function createInspector(data: any) {
  const token = await getToken();
  const response = await api.post('/admin/inspectors', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
} 