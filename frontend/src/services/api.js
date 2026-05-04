import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Train models
export const trainModels = async () => {
  const response = await api.post('/train');
  return response.data;
};

// Make prediction
export const makePrediction = async (employeeData) => {
  const response = await api.post('/predict', employeeData);
  return response.data;
};

// Get metrics
export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

// Get feature importance
export const getFeatureImportance = async () => {
  const response = await api.get('/feature-importance');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
