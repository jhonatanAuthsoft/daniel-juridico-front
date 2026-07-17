import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

import { useAuth } from './auth-provider';
import { homeHrefForRole, type UserRole } from './auth.types';

type RoleGuardProps = {
  allowedRole: UserRole;
  children: ReactNode;
};

/**
 * Ensures the user is authenticated and has the expected fixed role.
 * Wrong role → redirect to that role's shell (not a soft "hide UI").
 */
export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Redirect href="/login" />;
  }

  if (user.role !== allowedRole) {
    return <Redirect href={homeHrefForRole(user.role)} />;
  }

  return children;
}
