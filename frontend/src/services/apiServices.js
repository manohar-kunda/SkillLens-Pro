/**
 * -------------------------------------------------------
 * File: apiServices.js
 * Purpose: Aggregates client-side HTTP/Axios integrations
 * for careers, resumes, and recommend services.
 *
 * Responsibilities:
 * - Calls Express endpoints for predefined/custom career gap discovery
 * - Posts multi-part binary forms containing PDF resumes
 * - Retrieves scraped learning course links and mock exam recommendations
 *
 * Dependencies:
 * - axios
 * - authService (authorized Express Axios Client)
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

import axios from 'axios';
import { api } from './authService';

/**
 * Encapsulates career roles querying, gap matching algorithms, and autocomplete suggest operations.
 */
export const jobService = {
  /**
   * Retrieves all pre-configured job roles from database registers.
   *
   * @returns {Promise<Array>} - Array of job role objects
   */
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  /**
   * Compares the user's uploaded skills against a specific job role.
   *
   * @param {number|string} jobId - The target database job ID
   * @returns {Promise<Object>} - Gaps analytics breakdown
   */
  analyzeGaps: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/analyze-gap`);
    return response.data;
  },

  /**
   * Iterates custom AI role analysis, scraping Wikipedia and drawing Groq templates.
   *
   * @param {string} roleName - Free text job role name (e.g. 'Cybersecurity Specialist')
   * @returns {Promise<Object>} - Dynamic roadmap and fit breakdown
   */
  analyzeCustomRole: async (roleName) => {
    try {
      const start = Date.now();
      const response = await api.post(`/jobs/custom-roadmap`, { roleName });
      console.log(`[Roadmap] Discovery for "${roleName}" completed in ${Date.now() - start}ms`);
      return response.data;
    } catch (err) {
      console.error("[Roadmap] Analysis error:", err.message);
      throw err;
    }
  },

  /**
   * Scrapes Youtube & Roadmap.sh to retrieve custom video and curriculum paths.
   *
   * @param {string} roleName - The target career role
   * @returns {Promise<Object>} - Visual roadmap paths with links
   */
  getInDepthCurriculum: async (roleName) => {
    const response = await api.get(`/jobs/curriculum/${roleName}`);
    return response.data;
  },
  
  /**
   * Resolves search strings into autocomplete career role chips.
   *
   * @param {string} query - Typed character query
   * @returns {Promise<Object>} - Array of matching autocomplete results
   */
  getSuggestions: async (query) => {
    try {
      const start = Date.now();
      const response = await api.get(`/jobs/suggestions?q=${encodeURIComponent(query)}`);
      console.log(`[Job Search] Suggestions for "${query}" loaded in ${Date.now() - start}ms`);
      return response.data;
    } catch (err) {
      console.error("[Job Search] Suggestion fetch error:", err.message);
      return { suggestions: [] };
    }
  }
};

/**
 * Handles multipart resume uploads.
 */
export const resumeService = {
  /**
   * Dispatches binary files directly to Express upload controllers.
   *
   * @param {File} file - Browser file selection
   * @returns {Promise<Object>} - Parsed skills list and ATS score
   */
  upload: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Axios automatically sets the proper multipart/form-data header WITH the boundary when you pass FormData
    const response = await api.post('/resumes/upload', formData);
    return response.data;
  }
};

/**
 * Integrates customized learning path operations.
 */
export const learningService = {
  /**
   * Fetches courses and video channels mapped to a specific skill gap ID.
   *
   * @param {number|string} jobId - The target career role ID
   * @returns {Promise<Object>} - Catalog of mapped learning assets
   */
  getRecommendations: async (jobId) => {
    const response = await api.get(`/recommendations/${jobId}`);
    return response.data;
  },

  /**
   * Instructs backend evaluation engines to grade a resume against target competencies.
   *
   * @param {number|string} jobRoleId - ID of matching job
   * @param {string} customRole - Custom target string
   * @returns {Promise<Object>} - Overlap score percentages
   */
  scoreResume: async (jobRoleId, customRole) => {
    const response = await api.post('/recommendations/score', { jobRoleId, customRole });
    return response.data;
  }
};
