import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

import { useAuth } from './auth-provider';

type TermsGuardProps = {
  children: ReactNode;
};

/**
 * Blocks authenticated shells until terms are accepted.
 * Unauthenticated users are left to RoleGuard / login.
 */
export function TermsGuard({ children }: TermsGuardProps) {
  const { user, isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return children;
  }

  if (!user.termsAccepted) {
    return <Redirect href="/signup/terms" />;
  }

  return children;
}
