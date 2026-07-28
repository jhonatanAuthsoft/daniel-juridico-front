import type { AuthUser } from '@/domain/auth/auth.types';

import {
  clearAuthSession as clearPersistedSession,
  loadAuthSession as loadPersistedSession,
  saveAuthSession as savePersistedSession,
  type AuthSession,
} from './auth-storage';

export type { AuthSession };

type SessionListener = (session: AuthSession | null) => void;

let memorySession: AuthSession | null = null;
let hydrated = false;
const listeners = new Set<SessionListener>();

function notify(session: AuthSession | null) {
  for (const listener of listeners) {
    listener(session);
  }
}

export function subscribeAuthSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSessionMemory(): AuthSession | null {
  return memorySession;
}

export async function hydrateAuthSession(): Promise<AuthSession | null> {
  if (hydrated) {
    return memorySession;
  }

  const session = await loadPersistedSession();
  memorySession = session;
  hydrated = true;
  return memorySession;
}

export async function setAuthSession(session: AuthSession): Promise<void> {
  memorySession = session;
  hydrated = true;
  await savePersistedSession(session);
  notify(session);
}

export async function updateAuthTokens(tokens: {
  token: string;
  refreshToken: string;
}): Promise<AuthSession | null> {
  if (!memorySession) {
    await hydrateAuthSession();
  }

  if (!memorySession) {
    return null;
  }

  const next: AuthSession = {
    ...memorySession,
    token: tokens.token,
    refreshToken: tokens.refreshToken,
  };
  memorySession = next;
  await savePersistedSession(next);
  notify(next);
  return next;
}

export async function updateAuthUser(user: AuthUser): Promise<AuthSession | null> {
  if (!memorySession) {
    await hydrateAuthSession();
  }

  if (!memorySession) {
    return null;
  }

  const next: AuthSession = {
    ...memorySession,
    user,
  };
  memorySession = next;
  await savePersistedSession(next);
  notify(next);
  return next;
}

export async function clearAuthSessionStore(): Promise<void> {
  memorySession = null;
  hydrated = true;
  await clearPersistedSession();
  notify(null);
}
