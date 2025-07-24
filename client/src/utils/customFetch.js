import axios from 'axios';

const customFetch = axios.create({
  baseURL: 'https://jobhand.onrender.com/api/v1',
  withCredentials: true, // 关键
});

export default customFetch;