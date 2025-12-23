import session from './session';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  '';

function ensureBase() {
  if (!API_BASE) {
    throw new Error('API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.');
  }
}

function resolveUrl(input) {
  if (!input) {
    ensureBase();
    return API_BASE;
  }
  // If already absolute (http/https) return as-is
  if (/^https?:\/\//i.test(input)) return input;
  // If starts with '/' treat as path under API_BASE
  if (input.startsWith('/')) {
    ensureBase();
    return `${API_BASE}${input}`;
  }
  // Otherwise join
  ensureBase();
  return `${API_BASE}/${input}`;
}

export async function fetchWithAuth(url, options = {}) {
  const s = session.getSession();
  const token = s?.token;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const target = resolveUrl(url);
  const res = await fetch(target, {
    ...options,
    headers,
    // Avoid sending cookies by default to reduce CORS requirements;
    // set to 'include' only if your backend explicitly needs cookies.
    credentials: 'omit'
  });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : await res.text();
  if (res.status === 401 && typeof window !== 'undefined') {
    try { session.clearSession?.(); } catch {}
    window.location.href = '/login';
    const error = new Error('Unauthorized');
    error.status = res.status;
    throw error;
  }
  if (!res.ok) {
    const message = isJson ? body?.message || body?.error || 'Request failed' : body;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

export { API_BASE, resolveUrl };
export default { fetchWithAuth, API_BASE, resolveUrl };