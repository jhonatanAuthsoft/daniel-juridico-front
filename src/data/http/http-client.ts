import { HttpError } from './http-error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestConfig = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Single entry-point for all network requests in the app.
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
      typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof (payload as { message: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : `Request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as T;
}
