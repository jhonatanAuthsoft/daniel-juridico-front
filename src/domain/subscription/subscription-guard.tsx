import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useAuth, useMe } from '@/domain/auth';
import { readCachedSubscription } from '@/domain/subscription/subscription-cache';
import { useEffect, useState } from 'react';

type SubscriptionGuardProps = {
  children: ReactNode;
};

/**
 * Blocks lawyer shell until subscription access is granted (trial or active plan).
 */
export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const { data: me, isPending, isError } = useMe();
  const [cachedAccess, setCachedAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void readCachedSubscription().then((cached) => {
      if (active) {
        setCachedAccess(cached?.accessGranted ?? false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (isHydrating || isPending) {
    return <View style={{ flex: 1, backgroundColor: BrandColors.neutral.xdark }} />;
  }

  if (!isAuthenticated || !user || user.role !== 'LAWYER') {
    return children;
  }

  const accessGranted = me?.subscription?.accessGranted;
  if (accessGranted === true) {
    return children;
  }

  if (accessGranted === false) {
    return <Redirect href="/signup/subscription" />;
  }

  if (isError && cachedAccess) {
    return children;
  }

  if (accessGranted === undefined && !isError) {
    return <View style={{ flex: 1, backgroundColor: BrandColors.neutral.xdark }} />;
  }

  return <Redirect href="/signup/subscription" />;
}
