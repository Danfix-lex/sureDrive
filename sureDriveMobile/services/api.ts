import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.137.1:5000/api', // Updated to your Windows computer IP
  timeout: 10000,
});

export default api; 