const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000/api'
  : '/api';
