/**
 * -----------------------------------------------------------------------------
 * File: authService.js
 * Component: Frontend Service Layer
 * Purpose: Manages user session registrations, logins, local persistence,
 *          and establishes an authenticated HTTP client instance.
 *
 * Responsibilities:
 * - Perform Axios POST queries to backend auth endpoints.
 * - Set and delete active JWT tokens and profile credentials in browser LocalStorage.
 * - Instantiates a custom `api` Axios client with a dynamic request interceptor
 *   that automatically appends authorization Bearer tokens.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export { BASE_URL };

/**
 * Authentication service interface mapping registration and authentication requests.
 */
export const authService = {
  /**
   * Logs a user in, verifies credentials, and serializes token state inside localStorage.
   *
   * @param {string} email - Verified user email address.
   * @param {string} password - User password plain-text.
   * @returns {Promise<Object>} Backend authentication response object with token and user profiles.
   */
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  /**
   * Registers a new user account on the platform, saving sessions upon creation.
   *
   * @param {string} name - Candidate name.
   * @param {string} email - Registered email.
   * @param {string} password - Formulated password string.
   * @param {string} role - Platform authorization role ('user' | 'admin').
   * @returns {Promise<Object>} Backend response with session tokens and user data.
   */
  register: async (name, email, password, role) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  /**
   * Destroys active user sessions by purging credentials from browser storage.
   */
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  }
};

/**
 * Authorized HTTP client instance.
 * Preconfigured to route calls to API_URL.
 */
export const api = axios.create({
  baseURL: API_URL
});

// Axios Request Interceptor: Automatically injects JWT Bearer tokens to all outgoing queries
api.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
