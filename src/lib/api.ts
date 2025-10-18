
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Adjust to your API
  timeout: 10000,
});

// Optional: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Could dispatch logout here if integrated, but for now, log
      console.error('Unauthorized - please log in');
    }
    return Promise.reject(error);
  }
);

export default api;