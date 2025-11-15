'use client';

type StoredSession = {
  token: string;
  expiresAt: number;
};

const STORAGE_KEY = 'citypulse.session';

let inMemorySession: StoredSession | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readFromStorage(): StoredSession | null {
  if (!isBrowser()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || typeof parsed.expiresAt !== 'number') {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read session from storage', error);
    return null;
  }
}

function writeToStorage(session: StoredSession | null): void {
  if (!isBrowser()) {
    return;
  }
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to persist session', error);
  }
}

export function getStoredSession(): StoredSession | null {
  if (inMemorySession) {
    return inMemorySession;
  }
  const stored = readFromStorage();
  if (stored) {
    inMemorySession = stored;
  }
  return stored;
}

export function getToken(): string | null {
  const session = getStoredSession();
  if (!session) {
    return null;
  }
  if (session.expiresAt && Date.now() > session.expiresAt) {
    clearSession();
    return null;
  }
  return session.token;
}

export function setSession(token: string, expiresInSeconds: number): void {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const session: StoredSession = { token, expiresAt };
  inMemorySession = session;
  writeToStorage(session);
}

export function clearSession(): void {
  inMemorySession = null;
  writeToStorage(null);
}

