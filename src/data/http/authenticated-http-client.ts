import { ensureFreshAccessToken } from '@/data/auth/auth-refresh-controller';

import { httpRequest, type HttpRequestConfig } from './http-client';

export type AuthenticatedHttpRequestConfig = Omit<HttpRequestConfig, 'headers'> & {
  headers?: Record<string, string>;
};

/**
 * HTTP entry-point for authenticated calls.
 * Runs the auth middleware first: if the access token expires within 1 minute,
 * refreshes once (single-flight) and attaches the fresh Bearer token.
 */
export async function authenticatedHttpRequest<T>(
  url: string,
  config: AuthenticatedHttpRequestConfig = {},
): Promise<T> {
  const token = await ensureFreshAccessToken();

  return httpRequest<T>(url, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
