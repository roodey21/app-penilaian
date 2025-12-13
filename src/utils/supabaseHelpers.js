import supabase from '../lib/supabaseClient';

// Client-side helpers. Verification uses server API `/api/verify-dob`.
export async function requestVerifyDob(email, birthDate) {
  const res = await fetch('/api/verify-dob', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, birth_date: birthDate }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Verification failed');
  return data; // { token, user }
}

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

// Example simple CRUD helpers for assessments (extend as needed)
export async function createAssessment(payload) {
  const { data, error } = await supabase.from('assessments').insert([payload]).select();
  if (error) throw error;
  return data?.[0];
}

export async function createAssessmentResponse(payload) {
  const { data, error } = await supabase.from('assessment_responses').insert([payload]).select();
  if (error) throw error;
  return data?.[0];
}

export default {
  requestVerifyDob,
  fetchUserProfile,
  createAssessment,
  createAssessmentResponse,
};
