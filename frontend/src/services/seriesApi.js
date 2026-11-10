import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export async function getSeries(params = {}) {
  const response = await api.get('/series', { params });
  return response.data?.data || [];
}

export async function getSeriesBySlug(slug) {
  const response = await api.get(`/series/${encodeURIComponent(slug)}`);
  return response.data?.data;
}

export default api;
