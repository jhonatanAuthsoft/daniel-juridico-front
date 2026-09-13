import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/domain/auth';

import { getMySubscriptionUseCase } from './get-my-subscription.use-case';
import { readCachedSubscription } from './subscription-cache';
import { subscriptionKeys } from './subscription.keys';

export function useSubscription() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: subscriptionKeys.me(),
    queryFn: async ({ signal }) => {
      try {
        return await getMySubscriptionUseCase(signal);
      } catch {
        const cached = await readCachedSubscription();
        if (cached?.accessGranted) {
          return cached;
        }
        throw new Error('Não foi possível carregar a assinatura.');
      }
    },
    enabled: isAuthenticated && user?.role === 'LAWYER',
  });
}
