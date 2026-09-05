import { HttpError } from './http-error';
import { resolveApiErrorMessage, type ApiResponse } from './api-response';

/**
 * Unwraps a successful ApiResponse or throws HttpError with a mapped message.
 */
export function assertApiSuccess<T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
): T {
  if (response.success && response.data != null) {
    return response.data;
  }

  throw new HttpError(
    resolveApiErrorMessage(response, fallbackMessage),
    422,
    response,
  );
}

/**
 * Reads a display message from any thrown value (HttpError, Error, unknown).
 */
export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallbackMessage;
}

/**
 * Reads the first API error code from an HttpError body, when present.
 */
export function getErrorCode(error: unknown): string | undefined {
  if (!(error instanceof HttpError) || error.body == null || typeof error.body !== 'object') {
    return undefined;
  }

  const errors =
    'errors' in error.body && Array.isArray(error.body.errors)
      ? error.body.errors
      : null;
  const firstError = errors?.[0];
  if (
    firstError &&
    typeof firstError === 'object' &&
    'code' in firstError &&
    typeof (firstError as { code: unknown }).code === 'string'
  ) {
    const code = (firstError as { code: string }).code.trim();
    return code || undefined;
  }

  return undefined;
}
