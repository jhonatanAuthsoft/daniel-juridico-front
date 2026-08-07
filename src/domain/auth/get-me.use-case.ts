import { getMe } from '@/data/auth';

/**
 * Domain use case: authenticated profile (`GET /usuarios/me`).
 */
export function getMeUseCase(signal?: AbortSignal) {
  return getMe(signal);
}
