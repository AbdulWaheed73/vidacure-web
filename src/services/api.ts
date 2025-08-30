import axios from 'axios';
import { config } from '../constants';
import { getClientType } from '../utils';

// Create axios instance with appropriate headers
const clientType = getClientType();
// console.log('Client type detected:', clientType);
// console.log('Server URL:', config.getServerUrl());
// console.log('Frontend URL:', config.getFrontendUrl());

const csrfHeader = localStorage.getItem("csrfToken");
// console.log("csrf: ", csrfHeader);

export const api = axios.create({
  baseURL: config.getServerUrl(),
  headers: {
    'x-client': clientType,
    'x-csrf-token': csrfHeader,
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Update CSRF token in headers
export const updateCsrfToken = (token: string) => {
  api.defaults.headers['x-csrf-token'] = token;
};
