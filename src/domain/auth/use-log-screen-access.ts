import { useEffect } from 'react';

import { useAuth } from './auth-provider';
import { logScreenAccessUseCase } from './log-screen-access.use-case';

/**
 * Records each opening of a legal/account screen for the authenticated user.
 * Failures are swallowed so the screen remains usable offline.
 */
export function useLogScreenAccess(screen: 'TERMS') {
  const { isAuthenticated, isHydrating } = useAuth();

  useEffect(() => {
    if (isHydrating || !isAuthenticated) {
      return;
    }

    void logScreenAccessUseCase({ screen }).catch(() => undefined);
  }, [isAuthenticated, isHydrating, screen]);
}
