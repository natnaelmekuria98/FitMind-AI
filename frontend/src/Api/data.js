import axios from 'axios';

const API_BASE = 'https://ai-fitness-coach-app-project-48tt.onrender.com/api';
export const generatePlan = async (userData) => {
  const response = await axios.post(`${API_BASE}/generate-plan`, userData);
  return response.data;
};

export const generateImage = async (prompt) => {
  const response = await axios.post(`${API_BASE}/generate-image`, { prompt });
  return response.data.imageUrl;
};

export const generateVoice = async (text) => {
  const response = await axios.post(`${API_BASE}/generate-voice`, { text }, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};
