import {
  focusManager,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  applySubscriptionAccessRevoked,
  isSubscriptionRequiredError,
} from '@/domain/subscription/apply-subscription-access-revoked';

type QueryProviderProps = {
  children: ReactNode;
};

function syncQueryFocus(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function handleQueryError(queryClient: QueryClient, error: unknown) {
  if (isSubscriptionRequiredError(error)) {
    applySubscriptionAccessRevoked(queryClient);
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => handleQueryError(client, error),
      }),
      mutationCache: new MutationCache({
        onError: (error) => handleQueryError(client, error),
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            if (isSubscriptionRequiredError(error)) {
              return false;
            }
            return failureCount < 1;
          },
        },
      },
    });
    return client;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', syncQueryFocus);
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
