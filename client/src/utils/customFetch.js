import axios from 'axios';

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 关键
});

export default customFetch;