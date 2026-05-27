/**
 * -------------------------------------------------------
 * File: AuthContext.jsx
 * Purpose: Manages platform-wide React session context,
 * providing token synchronization and profile persistence.
 *
 * Responsibilities:
 * - Checks local storage on application mount to resolve session states
 * - Provides global login, logout, and registration contexts
 * - Syncs updated user info to local storage
 * - Automatically refreshes profile data from backend endpoints
 *
 * Dependencies:
 * - react (createContext, useState, useEffect)
 * - authService
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

/**
 * Higher-order provider component to share authentication states.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Logs in a user and binds their profile to the context state.
   *
   * @param {string} email - Registered email address
   * @param {string} password - Input password string
   * @returns {Promise<Object>} - Decoded auth response payload
   */
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  /**
   * Registers a new user account.
   *
   * @param {string} name - Account display name
   * @param {string} email - Target signup email
   * @param {string} password - Raw password input
   * @param {string} role - Desired role ('student' or 'admin')
   * @returns {Promise<Object>} - Decoded payload
   */
  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    setUser(data.user);
    return data;
  };

  /**
   * Clears context state and deletes active JWT token from storage.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Merges and updates profile values in both Context state and local storage.
   *
   * @param {Object} updatedData - Incremental profile patches
   */
  const updateUser = (updatedData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  /**
   * Queries the backend API to synchronize local profile settings.
   */
  const refreshUser = async () => {
    try {
      const { api } = await import('../services/authService');
      const res = await api.get('/users/profile');
      updateUser(res.data);
    } catch (err) {
      console.error("Refresh user failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
