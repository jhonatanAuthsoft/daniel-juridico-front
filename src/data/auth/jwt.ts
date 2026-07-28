/**
 * Decodes a JWT payload without verifying the signature.
 * Used only to read `exp` for proactive refresh.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeBase64(padded);
    const payload = JSON.parse(json) as unknown;
    if (!payload || typeof payload !== 'object') {
      return null;
    }
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

function decodeBase64(value: string): string {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  // Jest / Node fallback without pulling a polyfill into the app bundle.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Buffer } = require('buffer') as typeof import('buffer');
  return Buffer.from(value, 'base64').toString('utf8');
}

/** Returns JWT `exp` in epoch milliseconds, or null if missing/invalid. */
export function getJwtExpirationMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) {
    return null;
  }
  return exp * 1000;
}

/**
 * True when the access token is missing, already expired, or expires
 * within `thresholdMs` (default: 1 minute).
 */
export function isAccessTokenExpiringSoon(
  token: string | null | undefined,
  thresholdMs = 60_000,
  nowMs = Date.now(),
): boolean {
  if (!token?.trim()) {
    return true;
  }

  const expMs = getJwtExpirationMs(token);
  if (expMs == null) {
    // Unknown expiry — refresh to be safe when we have a refresh token.
    return true;
  }

  return expMs - nowMs <= thresholdMs;
}
