/**
 * Base URL for the Laweact API.
 * Override via EXPO_PUBLIC_API_BASE_URL in `.env`.
 *
 * Android emulator: use http://10.0.2.2:8080 instead of localhost.
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL is not set. Add it to app/.env (see .env.example).',
    );
  }

  return baseUrl.replace(/\/$/, '');
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
