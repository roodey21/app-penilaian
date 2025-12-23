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

  getGroupMapping: async () => fetchWithAuth('/assessments/group-mapping'),

  getAssessmentQuestions: async () => fetchWithAuth('/assessments/questions'),

  submitAnswers: async (payload) => {
    return fetchWithAuth('/engagement/answers/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Fetch existing answers for a target and period
  // Query params: target_user_id, period_id
  getAnswers: async ({ target_user_id, period_id }) => {
    const params = new URLSearchParams();
    if (target_user_id) params.append('target_user_id', String(target_user_id));
    if (period_id) params.append('period_id', String(period_id));
    const qs = params.toString();
    return fetchWithAuth(`/engagement/answers${qs ? `?${qs}` : ''}`);
  },
};

export default SurveyApi;
