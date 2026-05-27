/**
 * -----------------------------------------------------------------------------
 * File: interviewService.js
 * Component: Frontend Service Layer
 * Purpose: Manages communication with backend quiz templates generator and submission systems.
 *
 * Responsibilities:
 * - Make authorized HTTP calls via the intercepted `api` Axios client.
 * - Retrieve custom difficulty assessments for native and dynamically-extracted skills.
 * - Map dynamic properties (e.g. difficulty levels, aliases) as URL search parameters.
 * - Catch 404 response codes cleanly to indicate lack of question libraries.
 * - Submit finalized multiple-choice choices vector to score calculations engines.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import { api } from './authService';

/**
 * Service mapping API endpoints for assessment quizzes and mock technical evaluations.
 */
export const interviewService = {
  /**
   * Fetches multiple-choice assessment question templates for a targeted career skill.
   * Maps query criteria like target difficulty levels and skill name string values.
   *
   * @param {string|number} skillId - The numeric skill primary key, or "dyn-skill-*" string.
   * @param {string} skillName - Name string of the tech stack component.
   * @param {string} [difficulty=''] - Desired test difficulty level ('easy' | 'medium' | 'hard').
   * @returns {Promise<Object|null>} Mapped quiz questions payload, or null if no template exists.
   */
  getQuizForSkill: async (skillId, skillName, difficulty = '') => {
    try {
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      if (skillName) params.append('name', skillName);
      
      const url = `/quizzes/${skillId}?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      // Intercept 404 responses gracefully to alert frontend layouts that questions are pending
      if (error.response && error.response.status === 404) {
         return null;
      }
      throw error;
    }
  },
  
  /**
   * Submits candidate multiple choice selections to the evaluator engine.
   *
   * @param {number|string} quizId - Active quiz identifier.
   * @param {Object} answers - Vector mapping selections: { [questionId]: 'A' | 'B' | 'C' | 'D' }
   * @returns {Promise<Object>} Evaluated scoring metrics, percentages, and correct answers checklist review.
   */
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  }
};
