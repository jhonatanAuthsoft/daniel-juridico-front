import { HttpError } from './http-error';
import { resolveApiErrorMessage } from './api-response';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Single entry-point for all network requests in the app.
 * Failed HTTP responses throw HttpError with a user-facing mapped message.
 */
export async function httpRequest<T>(
  url: string,
  config: HttpRequestConfig = {},
): Promise<T> {
  const { method = 'GET', headers, body, signal } = config;

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      // Free ngrok serves an HTML interstitial without this header.
      'ngrok-skip-browser-warning': 'true',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new HttpError(
      resolveApiErrorMessage(
        payload,
        `Request failed with status ${response.status}`,
      ),
      response.status,
      payload,
    );
  }

  return payload as T;
}
