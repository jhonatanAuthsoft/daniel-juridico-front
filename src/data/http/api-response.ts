export type ApiErrorItem = {
  code?: string;
  field?: string;
  detail?: string;
};

export type ApiPagination = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  timestamp?: string;
  message?: string;
  data: T;
  pagination?: ApiPagination;
  errors?: ApiErrorItem[];
};

/**
 * Picks the best user-facing message from a Laweact API error envelope.
 * Preference: first `errors[].detail` → `message` → fallback.
 */
export function resolveApiErrorMessage(
  body: unknown,
  fallbackMessage: string,
): string {
  if (!body || typeof body !== 'object') {
    return fallbackMessage;
  }

  const errors =
    'errors' in body && Array.isArray(body.errors) ? body.errors : null;
  const firstError = errors?.[0];

  if (
    firstError &&
    typeof firstError === 'object' &&
    'detail' in firstError &&
    typeof (firstError as { detail: unknown }).detail === 'string' &&
    (firstError as { detail: string }).detail.trim()
  ) {
    return (firstError as { detail: string }).detail;
  }

  if (
    'message' in body &&
    typeof body.message === 'string' &&
    body.message.trim()
  ) {
    return body.message;
  }

  return fallbackMessage;
}
