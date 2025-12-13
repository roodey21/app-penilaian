import { fetchWithAuth } from '../utils/apiClient';

export const SurveyApi = {
  login: async ({ email, date_of_birth }) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, date_of_birth }),
    });
  },

  getActivePeriod: async () => fetchWithAuth('/periods/active'),

  getPeriods: async () => fetchWithAuth('/periods'),

  getAssessmentTargets: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('period_month', String(month));
    if (year) params.append('period_year', String(year));
    const qs = params.toString();
    return fetchWithAuth(`/assessments/targets${qs ? `?${qs}` : ''}`);
  },

  getAssessmentProgress: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('period_month', String(month));
    if (year) params.append('period_year', String(year));
    const qs = params.toString();
    return fetchWithAuth(`/assessments/progress${qs ? `?${qs}` : ''}`);
  },

  getQuestions: async () => fetchWithAuth('/engagement/questions'),

  submitAnswers: async (payload) => {
    return fetchWithAuth('/engagement/answers/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export default SurveyApi;
