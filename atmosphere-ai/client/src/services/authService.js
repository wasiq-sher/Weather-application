import apiClient from './apiClient.js';

const TOKEN_KEY = 'atmosphere_jwt_token';
const USER_KEY = 'atmosphere_user';

/**
 * Authentication Service for Atmosphere AI
 * Manages JWT tokens, user credentials, login, registration, and logout operations.
 * NO passwords are stored locally or in plaintext.
 */
export const authService = {
  /**
   * Get current stored JWT token
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get current stored User object
   */
  getUser() {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },

  /**
   * Save user session
   */
  setSession(token, user) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Clear user session
   */
  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Register a new user
   * @param {Object} credentials - { name, email, password }
   */
  async register({ name, email, password }) {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      
      const data = response?.data || response;
      // Do NOT set session on registration - user must sign in explicitly
      return data;
    } catch (error) {
      console.error('[authService] Registration failed:', error.message);
      throw error;
    }
  },

  /**
   * Log in user with credentials
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      const data = response?.data || response;
      if (data?.token && data?.user) {
        this.setSession(data.token, data.user);
      }
      return data;
    } catch (error) {
      console.error('[authService] Login failed:', error.message);
      throw error;
    }
  },

  /**
   * Fetch profile for current authenticated token
   */
  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      const data = response?.data || response;
      if (data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.warn('[authService] getMe failed:', error.message);
      if (error?.status === 401) {
        this.clearSession();
      }
      throw error;
    }
  },

  /**
   * Log out user
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout', {}).catch(() => {});
    } finally {
      this.clearSession();
    }
  },
};

export default authService;
