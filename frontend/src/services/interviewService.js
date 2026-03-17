import { api } from './authService';

export const interviewService = {
  getQuizForSkill: async (skillId, skillName, difficulty = '') => {
    try {
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      if (skillName) params.append('name', skillName);
      
      const url = `/quizzes/${skillId}?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
         return null; // No quiz available
      }
      throw error;
    }
  },
  
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  }
};
