import { fetchWithAuth, API_BASE } from '../utils/apiClient';

// All endpoints now point to external backend base (API_BASE)

export async function getActivePeriod() {
  return fetchWithAuth('/periods/active');
}

export async function getAssessmentProgress({ period_month, period_year }) {
  const params = new URLSearchParams({
    ...(period_month ? { period_month } : {}),
    ...(period_year ? { period_year } : {}),
  });
  return fetchWithAuth(`/assessments/progress?${params.toString()}`);
}

export async function getAssessmentTargets({ period_month, period_year }) {
  const params = new URLSearchParams({
    ...(period_month ? { period_month } : {}),
    ...(period_year ? { period_year } : {}),
  });
  return fetchWithAuth(`/assessments/targets?${params.toString()}`);
}

export async function getAssessmentGroupMapping() {
  return fetchWithAuth('/assessments/group-mapping');
}

export async function getQuestions({ periodId, type }) {
  const params = new URLSearchParams({
    ...(periodId ? { period_id: periodId } : {}),
    ...(type ? { type } : {}),
  });
  return fetchWithAuth(`/engagement/questions?${params.toString()}`);
}

export async function getTargetDetail({ periodId, type, targetId }) {
  const params = new URLSearchParams({
    ...(periodId ? { period_id: periodId } : {}),
    ...(type ? { type } : {}),
    ...(targetId ? { target_id: targetId } : {}),
  });
  return fetchWithAuth(`/assessments/target-detail?${params.toString()}`);
}

export async function submitAnswersBulk(payload) {
  return fetchWithAuth('/engagement/answers/bulk', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export default {
  API_BASE,
  getActivePeriod,
  getAssessmentProgress,
  getAssessmentTargets,
  getAssessmentGroupMapping,
  getQuestions,
  getTargetDetail,
  submitAnswersBulk,
};