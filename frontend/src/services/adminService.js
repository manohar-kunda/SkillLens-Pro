import { api } from './authService';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  addJobRole: async (title, description) => {
    const response = await api.post('/admin/jobs', { title, description });
    return response.data;
  },

  getJobRoles: async () => {
    const response = await api.get('/admin/job-roles');
    return response.data;
  },

  deleteJobRole: async (id) => {
    const response = await api.delete(`/admin/job-roles/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};
