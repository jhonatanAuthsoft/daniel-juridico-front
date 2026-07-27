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
