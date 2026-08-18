import { getAppEnv, type AppEnv } from '@/constants/app-env';

/**
 * Base URL for the Laweact API.
 * Override via EXPO_PUBLIC_API_BASE_URL in `.env` or EAS profile `env`.
 *
 * Android emulator: use http://10.0.2.2:8080 instead of localhost.
 */
const DEFAULT_API_BASE_URL: Record<AppEnv, string | undefined> = {
  development: undefined,
  staging: 'https://api-stg-laweact.authsoftsolutions.org',
  homolog: 'https://api-stg-laweact.authsoftsolutions.org',
  production: undefined,
};

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const baseUrl = fromEnv || DEFAULT_API_BASE_URL[getAppEnv()];

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
