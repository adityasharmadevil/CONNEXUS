import { clearSession, getToken } from './session.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const PUBLIC_PATHS = ['/api/v1/users/login', '/api/v1/users/register'];

function errorMessage(result, status) {
  if (typeof result === 'object' && result !== null) {
    // Spring ProblemDetail: { detail, errors? }
    if (result.errors && typeof result.errors === 'object') {
      const fields = Object.entries(result.errors).map(([field, msg]) => `${field}: ${msg}`);
      if (fields.length) return fields.join(', ');
    }
    return result.detail || result.message || result.error || `Request failed (${status})`;
  }
  return result || `Request failed (${status})`;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('json') ? await response.json() : await response.text();

  if (!response.ok) {
    // Expired or missing token on a protected call: drop the session and go to the login page
    if (response.status === 401 && !PUBLIC_PATHS.includes(path)) {
      clearSession();
      window.location.assign('/login');
    }
    throw new Error(errorMessage(result, response.status));
  }

  return result;
}

export const userApi = {
  register: (user) =>
    apiRequest('/api/v1/users/register', { method: 'POST', body: JSON.stringify(user) }),
  login: (credentials) =>
    apiRequest('/api/v1/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getUsers: () => apiRequest('/api/v1/users'),
  // The backend reads the user from the Bearer token
  logout: () => apiRequest('/api/v1/users/logout', { method: 'POST' }),
};