import axios from 'axios';
import { api } from './authService';

export const jobService = {
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  analyzeGaps: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/analyze-gap`);
    return response.data;
  },

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

  getInDepthCurriculum: async (roleName) => {
    const response = await api.get(`/jobs/curriculum/${roleName}`);
    return response.data;
  },
  
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

export const resumeService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Axios automatically sets the proper multipart/form-data header WITH the boundary when you pass FormData
    const response = await api.post('/resumes/upload', formData);
    return response.data;
  }
};

export const learningService = {
  getRecommendations: async (jobId) => {
    const response = await api.get(`/recommendations/${jobId}`);
    return response.data;
  },

  scoreResume: async (jobRoleId, customRole) => {
    const response = await api.post('/recommendations/score', { jobRoleId, customRole });
    return response.data;
  }
};
