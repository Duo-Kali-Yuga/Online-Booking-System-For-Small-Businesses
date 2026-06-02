import axios from 'axios';

const api = axios.create({
  // Use your local backend port
  //baseURL: import.meta.env.VITE_API_URL || 'https://bookingbusinesses.onrender.com/api',

  // Use your Internet backend port
    //baseURL: "http://localhost:5000/api",
    baseURL: "https://bookingbusinesses.onrender.com/api",
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