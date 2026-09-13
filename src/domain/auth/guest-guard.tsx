import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BrandColors } from '@/constants/theme';

import { useAuth } from './auth-provider';

type GuestGuardProps = {
  children: ReactNode;
};

/**
 * Blocks guest-only screens (login, cadastro) once a session exists.
 * Authenticated users go to their role home.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isHydrating, homeHref } = useAuth();

  // Never return `null` on Android Fabric — empty unmount/remount of the
  // navigator tree contributes to addViewAt crashes after login.
  if (isHydrating) {
    return <View style={{ flex: 1, backgroundColor: BrandColors.neutral.xdark }} />;
  }

  if (isAuthenticated) {
    return <Redirect href={homeHref} />;
  }

  return children;
}
