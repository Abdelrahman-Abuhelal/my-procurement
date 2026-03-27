const AUTH_STORAGE_KEY = 'procurement_portal_auth';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export interface StoredAuthSession {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  expiresAt: number;
}

export function readStoredSession(): StoredAuthSession | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as StoredAuthSession;
    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeStoredSession(session: StoredAuthSession) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
}
