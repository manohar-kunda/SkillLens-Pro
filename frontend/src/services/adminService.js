/**
 * -----------------------------------------------------------------------------
 * File: adminService.js
 * Component: Frontend Service Layer
 * Purpose: Handles REST API transactions for administrator operations, including
 *          system stats compilation, catalog modifications, and accounts management.
 *
 * Responsibilities:
 * - Make authorized HTTP calls via the intercepted `api` Axios client.
 * - Retrieve user demographic lists and aggregated platform metrics dashboard data.
 * - Add or remove curated job catalog configurations dynamically.
 * - Delete user registrations in case of compliance issues.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import { api } from './authService';

/**
 * Service mapping API calls for the administrative management panel interface.
 */
export const adminService = {
  /**
   * Fetches high-level usage and engagement metrics (counts for users, resumes, assessments).
   *
   * @returns {Promise<Object>} Statistics payload containing raw numbers and charts arrays.
   */
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  /**
   * Retrieves a comprehensive directory of user profiles registered on the platform.
   *
   * @returns {Promise<Array<Object>>} List of user accounts objects.
   */
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  /**
   * Adds a new pre-mapped job role template to the catalog database.
   *
   * @param {string} title - Unique job title name.
   * @param {string} description - Core responsibilities and skills required description.
   * @returns {Promise<Object>} Backend success state and insert IDs.
   */
  addJobRole: async (title, description) => {
    const response = await api.post('/admin/jobs', { title, description });
    return response.data;
  },

  /**
   * Retrieves all administrative job roles currently cataloged.
   *
   * @returns {Promise<Array<Object>>} List of job roles data.
   */
  getJobRoles: async () => {
    const response = await api.get('/admin/job-roles');
    return response.data;
  },

  /**
   * Removes a targeted job role template structure from the MySQL database.
   * Note: This propagates cascading deletions on dependent user skill gap logs.
   *
   * @param {number|string} id - The unique primary key of the targeted job role.
   * @returns {Promise<Object>} Database delete status response.
   */
  deleteJobRole: async (id) => {
    const response = await api.delete(`/admin/job-roles/${id}`);
    return response.data;
  },

  /**
   * Permanently deletes a user registration and purges all their upload files.
   *
   * @param {number|string} id - Database user ID.
   * @returns {Promise<Object>} Deletion success acknowledgement.
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};
