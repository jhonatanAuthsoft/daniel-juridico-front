import { getPublicLawyerProfile } from '@/data/lawyer';

/**
 * Domain use case: public lawyer profile (`GET /advogados/{id}`).
 */
export function getPublicLawyerProfileUseCase(
  lawyerUserId: string,
  signal?: AbortSignal,
) {
  return getPublicLawyerProfile(lawyerUserId, signal);
}
