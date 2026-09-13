import type { QueryClient } from '@tanstack/react-query';

import type { MeResult } from '@/data/auth';
import { getErrorCode } from '@/data/http';
import type { SubscriptionResult } from '@/data/subscription';
import { authKeys } from '@/domain/auth/auth.keys';

import { writeCachedSubscription } from './subscription-cache';

const SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED';

const BLOCKED_SUBSCRIPTION: SubscriptionResult = {
  status: 'PENDENTE',
  accessGranted: false,
  periodEndsAt: null,
  platform: null,
  productId: 'laweact_basic_mensal',
  autoRenewing: false,
};

export function isSubscriptionRequiredError(error: unknown): boolean {
  return getErrorCode(error) === SUBSCRIPTION_REQUIRED;
}

/**
 * Marks lawyer access as revoked so `SubscriptionGuard` can send the user to the paywall.
 * Used when an API call returns `SUBSCRIPTION_REQUIRED` while `/usuarios/me` is still cached.
 */
export function applySubscriptionAccessRevoked(queryClient: QueryClient): void {
  queryClient.setQueryData<MeResult>(authKeys.me(), (current) => {
    if (!current) {
      return current;
    }
    if (current.subscription?.accessGranted === false) {
      return current;
    }
    return {
      ...current,
      subscription: current.subscription
        ? {
            ...current.subscription,
            accessGranted: false,
          }
        : BLOCKED_SUBSCRIPTION,
    };
  });

  const updated = queryClient.getQueryData<MeResult>(authKeys.me());
  if (updated?.subscription) {
    void writeCachedSubscription(updated.subscription);
  }

  void queryClient.invalidateQueries({ queryKey: authKeys.me() });
}
