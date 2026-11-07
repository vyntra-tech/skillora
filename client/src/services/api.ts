import apiClient from '../api/client';
import {
  ApiResponse,
  Job,
  Company,
  Internship,
  Category,
  Location,
  Skill,
  Batch,
  Article,
  PracticeQuestion,
  Faq,
  CareerTool,
  Application,
  User,
  Setting,
} from '../types';

export const jobService = {
  getJobs: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Job[]>>('/jobs', { params }).then((res) => res.data),

  getClosingSoonJobs: (limit = 6) =>
    apiClient.get<ApiResponse<Job[]>>('/jobs/closing-soon', { params: { limit } }).then((res) => res.data),

  getJobBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; data: Job; relatedJobs: Job[] }>(`/jobs/${slug}`).then((res) => res.data),

  createJob: (data: Partial<Job>) =>
    apiClient.post<ApiResponse<Job>>('/jobs', data).then((res) => res.data),

  updateJob: (id: string, data: Partial<Job>) =>
    apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, data).then((res) => res.data),

  deleteJob: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/jobs/${id}`).then((res) => res.data),

  duplicateJob: (id: string) =>
    apiClient.post<ApiResponse<Job>>(`/jobs/${id}/duplicate`).then((res) => res.data),

  updateJobStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/status`, { status }).then((res) => res.data),
};

export const internshipService = {
  getInternships: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Internship[]>>('/internships', { params }).then((res) => res.data),

  getInternshipBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; data: Internship; relatedInternships: Internship[] }>(`/internships/${slug}`).then((res) => res.data),

  createInternship: (data: Partial<Internship>) =>
    apiClient.post<ApiResponse<Internship>>('/internships', data).then((res) => res.data),

  updateInternship: (id: string, data: Partial<Internship>) =>
    apiClient.put<ApiResponse<Internship>>(`/internships/${id}`, data).then((res) => res.data),

  deleteInternship: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/internships/${id}`).then((res) => res.data),
};

export const companyService = {
  getCompanies: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Company[]>>('/companies', { params }).then((res) => res.data),

  getCompanyBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; data: Company & { jobs: Job[]; internships: Internship[]; stats: { totalJobs: number; totalInternships: number } } }>(`/companies/${slug}`).then((res) => res.data),

  createCompany: (data: Partial<Company>) =>
    apiClient.post<ApiResponse<Company>>('/companies', data).then((res) => res.data),

  updateCompany: (id: string, data: Partial<Company>) =>
    apiClient.put<ApiResponse<Company>>(`/companies/${id}`, data).then((res) => res.data),

  deleteCompany: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/companies/${id}`).then((res) => res.data),
};

export const categoryService = {
  getCategories: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Category[]>>('/categories', { params }).then((res) => res.data),

  createCategory: (data: Partial<Category>) =>
    apiClient.post<ApiResponse<Category>>('/categories', data).then((res) => res.data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data).then((res) => res.data),

  deleteCategory: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/categories/${id}`).then((res) => res.data),
};

export const locationService = {
  getLocations: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Location[]>>('/locations', { params }).then((res) => res.data),

  createLocation: (data: Partial<Location>) =>
    apiClient.post<ApiResponse<Location>>('/locations', data).then((res) => res.data),

  updateLocation: (id: string, data: Partial<Location>) =>
    apiClient.put<ApiResponse<Location>>(`/locations/${id}`, data).then((res) => res.data),

  deleteLocation: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/locations/${id}`).then((res) => res.data),
};

export const skillService = {
  getSkills: () =>
    apiClient.get<ApiResponse<Skill[]>>('/skills').then((res) => res.data),

  createSkill: (data: Partial<Skill>) =>
    apiClient.post<ApiResponse<Skill>>('/skills', data).then((res) => res.data),

  updateSkill: (id: string, data: Partial<Skill>) =>
    apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, data).then((res) => res.data),

  deleteSkill: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/skills/${id}`).then((res) => res.data),
};

export const batchService = {
  getBatches: () =>
    apiClient.get<ApiResponse<Batch[]>>('/batches').then((res) => res.data),

  createBatch: (data: Partial<Batch>) =>
    apiClient.post<ApiResponse<Batch>>('/batches', data).then((res) => res.data),

  updateBatch: (id: string, data: Partial<Batch>) =>
    apiClient.put<ApiResponse<Batch>>(`/batches/${id}`, data).then((res) => res.data),

  deleteBatch: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/batches/${id}`).then((res) => res.data),
};

export const articleService = {
  getArticles: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Article[]>>('/articles', { params }).then((res) => res.data),

  getArticleBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; data: Article; relatedArticles: Article[] }>(`/articles/${slug}`).then((res) => res.data),

  createArticle: (data: Partial<Article>) =>
    apiClient.post<ApiResponse<Article>>('/articles', data).then((res) => res.data),

  updateArticle: (id: string, data: Partial<Article>) =>
    apiClient.put<ApiResponse<Article>>(`/articles/${id}`, data).then((res) => res.data),

  deleteArticle: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/articles/${id}`).then((res) => res.data),
};

export const practiceService = {
  getPracticeQuestions: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<PracticeQuestion[]>>('/practice', { params }).then((res) => res.data),

  createPracticeQuestion: (data: Partial<PracticeQuestion>) =>
    apiClient.post<ApiResponse<PracticeQuestion>>('/practice', data).then((res) => res.data),

  updatePracticeQuestion: (id: string, data: Partial<PracticeQuestion>) =>
    apiClient.put<ApiResponse<PracticeQuestion>>(`/practice/${id}`, data).then((res) => res.data),

  deletePracticeQuestion: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/practice/${id}`).then((res) => res.data),
};

export const faqService = {
  getFaqs: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Faq[]>>('/faqs', { params }).then((res) => res.data),

  createFaq: (data: Partial<Faq>) =>
    apiClient.post<ApiResponse<Faq>>('/faqs', data).then((res) => res.data),

  updateFaq: (id: string, data: Partial<Faq>) =>
    apiClient.put<ApiResponse<Faq>>(`/faqs/${id}`, data).then((res) => res.data),

  deleteFaq: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/faqs/${id}`).then((res) => res.data),
};

export const toolService = {
  getTools: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<CareerTool[]>>('/tools', { params }).then((res) => res.data),

  createTool: (data: Partial<CareerTool>) =>
    apiClient.post<ApiResponse<CareerTool>>('/tools', data).then((res) => res.data),

  updateTool: (id: string, data: Partial<CareerTool>) =>
    apiClient.put<ApiResponse<CareerTool>>(`/tools/${id}`, data).then((res) => res.data),

  deleteTool: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/tools/${id}`).then((res) => res.data),
};

export const applicationService = {
  submitApplication: (data: any) =>
    apiClient.post<ApiResponse<Application>>('/applications', data).then((res) => res.data),

  getMyApplications: () =>
    apiClient.get<ApiResponse<Application[]>>('/applications/my').then((res) => res.data),

  getAdminApplications: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<Application[]>>('/applications', { params }).then((res) => res.data),

  updateApplicationStatus: (id: string, status: string, notes?: string) =>
    apiClient.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status, notes }).then((res) => res.data),
};

export const userService = {
  getUsers: (params?: Record<string, any>) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params }).then((res) => res.data),

  updateUserRole: (id: string, role: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role }).then((res) => res.data),

  toggleUserBlock: (id: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/block`).then((res) => res.data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`).then((res) => res.data),
};

export const settingService = {
  getSettings: () =>
    apiClient.get<ApiResponse<Setting>>('/settings').then((res) => res.data),

  updateSettings: (data: Partial<Setting>) =>
    apiClient.put<ApiResponse<Setting>>('/settings', data).then((res) => res.data),
};

export const analyticsService = {
  getDashboardStats: () =>
    apiClient.get<ApiResponse<any>>('/analytics/dashboard').then((res) => res.data),

  getPublicStats: () =>
    apiClient.get<ApiResponse<any>>('/analytics/public-stats').then((res) => res.data),

  globalSearch: (q: string) =>
    apiClient.get<ApiResponse<any>>('/analytics/search', { params: { q } }).then((res) => res.data),
};

export const uploadService = {
  uploadFile: async (file: File, folder = 'general'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await apiClient.post<{ success: boolean; url: string }>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  },
};

