import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BrandColors } from '@/constants/theme';

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
  const { user, isAuthenticated, isHydrating } = useAuth();

  // Never return `null` on Android Fabric — empty unmount/remount of the
  // navigator tree contributes to addViewAt crashes after login.
  if (isHydrating) {
    return <View style={{ flex: 1, backgroundColor: BrandColors.neutral.xdark }} />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/login" />;
  }

  if (user.role !== allowedRole) {
    return <Redirect href={homeHrefForRole(user.role)} />;
  }

  return children;
}
