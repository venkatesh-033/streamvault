import axios from 'axios';

const libraryId = process.env.BUNNY_LIBRARY_ID;
const apiKey = process.env.BUNNY_LIBRARY_API_KEY;

function api() {
  if (!libraryId || !apiKey) throw new Error('Bunny Stream credentials are missing from backend/.env');
  return axios.create({
    baseURL: `https://video.bunnycdn.com/library/${libraryId}`,
    headers: { AccessKey: apiKey, Accept: 'application/json' },
    timeout: 30000
  });
}

export async function createBunnyVideo(title) {
  const response = await api().post('/videos', { title });
  return response.data.guid;
}

export async function uploadBunnyVideo(videoId, buffer) {
  await api().put(`/videos/${videoId}`, buffer, {
    headers: { 'Content-Type': 'application/octet-stream' },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 0
  });
}

export async function getBunnyVideo(videoId) {
  const response = await api().get(`/videos/${videoId}`);
  return response.data;
}
