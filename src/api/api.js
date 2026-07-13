import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-whdj.onrender.com/api/madicines',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
