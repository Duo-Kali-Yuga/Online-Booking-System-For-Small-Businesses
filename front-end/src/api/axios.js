import axios from 'axios';

const api = axios.create({
  // Use your local backend port
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',

  // Use your Internet backend port
  baseURL: "https://bookingbusinesses.onrender.com",
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;