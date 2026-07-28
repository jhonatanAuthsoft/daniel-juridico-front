import { refreshTokens } from './refresh.api';
import { isAccessTokenExpiringSoon } from './jwt';
import {
  clearAuthSessionStore,
  getAuthSessionMemory,
  hydrateAuthSession,
  updateAuthTokens,
  type AuthSession,
} from './session-store';

/** Access token is refreshed when it expires within this window. */
export const ACCESS_TOKEN_REFRESH_THRESHOLD_MS = 60_000;

let inflightRefresh: Promise<AuthSession> | null = null;

/**
 * Single-flight refresh controller.
 * Concurrent callers await the same promise so only one `/usuarios/refresh`
 * runs and all receive the same rotated token pair.
 */
export async function ensureFreshAccessToken(
  thresholdMs = ACCESS_TOKEN_REFRESH_THRESHOLD_MS,
): Promise<string> {
  const session =
    getAuthSessionMemory() ?? (await hydrateAuthSession());

  if (!session?.token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!isAccessTokenExpiringSoon(session.token, thresholdMs)) {
    return session.token;
  }

  if (!session.refreshToken) {
    await clearAuthSessionStore();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (inflightRefresh) {
    const refreshed = await inflightRefresh;
    return refreshed.token;
  }

  const snapshot = session;
  inflightRefresh = (async () => {
    try {
      const tokens = await refreshTokens({
        token: snapshot.token,
        refreshToken: snapshot.refreshToken,
      });
      const next = await updateAuthTokens(tokens);
      if (!next) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      return next;
    } catch (error) {
      await clearAuthSessionStore();
      throw error;
    } finally {
      inflightRefresh = null;
    }
  })();

  const refreshed = await inflightRefresh;
  return refreshed.token;
}

/** Exposed for tests — whether a refresh is currently running. */
export function isRefreshInFlight(): boolean {
  return inflightRefresh != null;
}
