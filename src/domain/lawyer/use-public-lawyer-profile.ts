import { useQuery } from '@tanstack/react-query';

import { getPublicLawyerProfileUseCase } from './get-public-lawyer-profile.use-case';
import { lawyerKeys } from './lawyer.keys';

/**
 * Domain hook: public lawyer profile for the client (`GET /advogados/{id}`).
 */
export function usePublicLawyerProfile(lawyerUserId: string | undefined) {
  const id = lawyerUserId?.trim() ?? '';

  return useQuery({
    queryKey: lawyerKeys.publicProfile(id),
    queryFn: ({ signal }) => getPublicLawyerProfileUseCase(id, signal),
    enabled: id.length > 0,
  });
}
