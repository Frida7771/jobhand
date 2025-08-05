// customFetch.ts
import axios, { AxiosInstance } from 'axios';

const customFetch: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

export default customFetch;
