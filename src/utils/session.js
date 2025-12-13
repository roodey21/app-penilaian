const SESSION_KEY = 'app_penilaian_session';

export function setSession({ token, user, expiresAt }) {
  // user may contain role info; we persist as-is
  const payload = { token, user, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function getSession() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (payload.expiresAt && new Date(payload.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default { setSession, getSession, clearSession };
