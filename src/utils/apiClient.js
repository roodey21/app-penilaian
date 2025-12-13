import session from './session';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://dashboard.test/api';

function resolveUrl(input) {
  if (!input) return API_BASE;
  // If already absolute (http/https) return as-is
  if (/^https?:\/\//i.test(input)) return input;
  // If starts with '/' treat as path under API_BASE
  if (input.startsWith('/')) return `${API_BASE}${input}`;
  // Otherwise join
  return `${API_BASE}/${input}`;
}

export async function fetchWithAuth(url, options = {}) {
  const s = session.getSession();
  const token = s?.token;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const target = resolveUrl(url);
  const res = await fetch(target, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson ? body?.message || body?.error || 'Request failed' : body;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  if (res.status === 401 && typeof window !== 'undefined') {
    try { session.clearSession?.(); } catch {}
    window.location.href = '/login';
    return;
  }
  return body;
}

export { API_BASE, resolveUrl };
export default { fetchWithAuth, API_BASE, resolveUrl };