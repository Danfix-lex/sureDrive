import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.36:5000/api', // TODO: Replace with your backend IP and port
  timeout: 10000,
});

export default api; 