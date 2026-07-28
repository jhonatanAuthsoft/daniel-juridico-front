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

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Base64 → binary string without Node `buffer` (Metro/RN cannot import it).
 * JWT payloads used here are ASCII JSON (`exp`, etc.).
 */
function decodeBase64(value: string): string {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  let output = '';
  const cleaned = value.replace(/[^A-Za-z0-9+/=]/g, '');

  for (let i = 0; i < cleaned.length; i += 4) {
    const c1 = cleaned[i] ?? 'A';
    const c2 = cleaned[i + 1] ?? 'A';
    const c3 = cleaned[i + 2] ?? '=';
    const c4 = cleaned[i + 3] ?? '=';

    const enc1 = BASE64_ALPHABET.indexOf(c1);
    const enc2 = BASE64_ALPHABET.indexOf(c2);
    const enc3 = c3 === '=' ? 0 : BASE64_ALPHABET.indexOf(c3);
    const enc4 = c4 === '=' ? 0 : BASE64_ALPHABET.indexOf(c4);

    const bitmap = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;
    output += String.fromCharCode((bitmap >> 16) & 255);
    if (c3 !== '=') {
      output += String.fromCharCode((bitmap >> 8) & 255);
    }
    if (c4 !== '=') {
      output += String.fromCharCode(bitmap & 255);
    }
  }

  return output;
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
