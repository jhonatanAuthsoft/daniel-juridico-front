import { useQuery } from '@tanstack/react-query';

import { useAuth } from './auth-provider';
import { authKeys } from './auth.keys';
import { getMeUseCase } from './get-me.use-case';

/**
 * Domain hook: authenticated profile (`GET /usuarios/me`).
 */
export function useMe() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => getMeUseCase(signal),
    enabled: isAuthenticated,
  });
}
